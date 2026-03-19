import 'dart:typed_data';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'shared.dart';

class RelayService {
  static final RelayService _instance = RelayService._internal();
  factory RelayService() => _instance;
  RelayService._internal();

  IO.Socket? socket;
  String? currentShopId;

  // Callback to parent UI when a new job starts streaming
  Function(String fileName, double progress)? onProgress;
  // Callback when a file is fully received
  Function(String fileName, Uint8List fileData)? onComplete;

  // Track currently downloading file
  final Map<String, List<int>> _activeChunks = {};

  void connect(String shopId) {
    currentShopId = shopId;
    
    // Replace with your local machine's IP address if testing on a real device
    // On Windows Emulator/Local, localhost or 10.0.2.2 usually works.
    socket = IO.io('http://localhost:3000', 
      IO.OptionBuilder()
        .setTransports(['websocket'])
        .disableAutoConnect()
        .build()
    );

    socket!.onConnect((_) {
      print('Connected to Relay Server');
      socket!.emit('shop-online', shopId);
    });

    socket!.on('incoming-file-chunk', (data) {
      final fileName = data['fileName'] as String;
      final chunk = data['chunk'] as List<int>;
      final isFirst = data['isFirst'] as bool;
      final isLast = data['isLast'] as bool;
      final totalSize = data['totalSize'] as int;

      if (isFirst) {
        _activeChunks[fileName] = [];
      }

      if (_activeChunks.containsKey(fileName)) {
        _activeChunks[fileName]!.addAll(chunk);
        
        // Calculate progress
        final currentSize = _activeChunks[fileName]!.length;
        final progress = currentSize / totalSize;
        onProgress?.call(fileName, progress);

        if (isLast) {
          final fullData = Uint8List.fromList(_activeChunks[fileName]!);
          _activeChunks.remove(fileName);
          onComplete?.call(fileName, fullData);
        }
      }
    });

    socket!.connect();
  }

  void disconnect() {
    socket?.disconnect();
  }
}
