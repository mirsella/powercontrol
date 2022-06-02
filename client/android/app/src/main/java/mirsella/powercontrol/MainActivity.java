package mirsella.powercontrol;

import android.os.Bundle;
import android.webkit.ValueCallback;
import android.net.Uri;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import android.content.Intent;  
import com.getcapacitor.annotation.CapacitorPlugin;

public class MainActivity extends BridgeActivity {
  Intent intent;
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    intent = getIntent();
  }

  public void onResume() {
    super.onResume();
    Uri uri = bridge.getIntentUri();
    String url = null;
    if (uri != null) {
      url = uri.toString();
    }
    if (url == null) {
      url = intent.getDataString();
    }
    bridge.triggerJSEvent("testintent", "window",  "{'onResume':'" + url +"'}");
  }

  @Override
  public void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    Uri uri = intent.getData();
    String url = null;
    if (uri != null) {
      url = uri.toString();
    }
    bridge.triggerJSEvent("testintent", "window",  "{'onNewIntent':'" + url +"'}");
  }
}
