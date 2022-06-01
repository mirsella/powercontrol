package mirsella.powercontrol;

import android.os.Bundle;
import android.webkit.ValueCallback;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import android.content.Intent;  

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
  }

  public void onResume() {
    super.onResume();
  //   Intent intent = getIntent();
  //   String action = intent.getAction();
  //   String scheme = intent.getScheme();
  //   String type = intent.getType();
  //   bridge.getActivity().setIntent(intent);
  //   bridge.triggerJSEvent("testintent", "window",  scheme);
  // bridge.triggerJSEvent("testintent", "window",  "{'data': 'test'}");
    bridge.eval("window.dispatchEvent(new Event('testintent'))", new ValueCallback<String>() {
      @Override
      public void onReceiveValue(String s) {
      }
    });
    }
}
