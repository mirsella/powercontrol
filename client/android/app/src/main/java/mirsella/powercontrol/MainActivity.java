package mirsella.powercontrol;

import android.os.Bundle;
import android.net.Uri;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.JSObject;
import com.getcapacitor.annotation.CapacitorPlugin;

import android.content.Intent;  
import android.util.Log;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    registerPlugin(getIntentPlugin.class);
  }

  @Override
  public void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    Uri uri = intent.getData();
    String url = null;
    if (uri != null) {
      url = uri.toString();
      bridge.triggerJSEvent("testintent", "window", new JSObject().put("value", url));
    }
  }

  // @Override
  // public void onResume() {
  //   super.onResume();
  //   Uri uri = getIntent().getData();
  //   String url = null;
  //   if (uri != null) {
  //     url = uri.toString();
  //     bridge.triggerJSEvent("testintent", "window",  "{'onresume':'" + url +"'}");
  //   }
  // }
}

