package mirsella.powercontrol;

import android.os.Bundle;
import android.webkit.ValueCallback;
import android.net.Uri;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import android.content.Intent;  
import com.getcapacitor.annotation.CapacitorPlugin;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
  }

  public void onResume() {
    super.onResume();
    Uri uri = bridge.getIntentUri();
    String url = null;
    if (uri != null) {
      url = uri.toString();
    }
    // bridge.triggerJSEvent("testintent", "window",  "{'onResume':'" + url +"'}");
    bridge.eval("window.dispatchEvent(new Event('sendIntentReceived', {'detail': 'from bridgeveal onResume'}))", new ValueCallback<String>() {
      @Override
      public void onReceiveValue(String s) {
      }
    });
  }

  @Override
  public void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    Uri uri = intent.getData();
    String url = null;
    if (uri != null) {
      url = uri.toString();
    }
    // bridge.triggerJSEvent("testintent", "window",  "{'onNewIntent':'" + url +"'}");
    bridge.eval("window.dispatchEvent(new Event('sendIntentReceived', {'detail': 'from bridgeveal onNewIntent'}))", new ValueCallback<String>() {
      @Override
      public void onReceiveValue(String s) {
      }
    });
  }
}
