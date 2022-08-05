package mirsella.powercontrol;

import android.os.Bundle;
import android.net.Uri;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.annotation.CapacitorPlugin;

import android.content.Intent;  

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    registerPlugin(getIntentPlugin.class);
    super.onCreate(savedInstanceState);
  }

  @Override
  public void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    Uri uri = intent.getData();
    String url = null;
    if (uri != null) {
      url = uri.toString();
      bridge.triggerJSEvent("intentUrl", "window", "{'value':'" + url +"'}");
    }
  }
}
