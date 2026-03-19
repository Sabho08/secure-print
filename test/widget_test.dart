import 'package:flutter_test/flutter_test.dart';
import 'package:test_out/main.dart';

void main() {
  testWidgets('App smoke test — login screen renders', (WidgetTester tester) async {
    await tester.pumpWidget(const Application());
    await tester.pump();
    // Login screen should be present
    expect(find.text('SecurePrint'), findsWidgets);
  });
}
