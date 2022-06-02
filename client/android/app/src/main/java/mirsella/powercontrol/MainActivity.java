package mirsella.powercontrol;

import android.os.Bundle;
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

  @Override
  protected void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    setIntent(intent);
  }

  @Override
  protected void onResume() {
    super.onResume();
    Uri uri = getIntent().getData();
    String url = null;
    if (uri != null) {
      url = uri.toString();
    }
    bridge.triggerJSEvent("testintent", "window",  "{'onresume':'" + url +"'}");
  }
}


