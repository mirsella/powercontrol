package mirsella.powercontrol;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
// import com.getcapacitor.bridge;

import android.content.Intent;  

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
  }

  // get url scheme intent
  public void onResume() {
    super.onResume();
    Intent intent = getIntent();
    String action = intent.getAction();
    String scheme = intent.getScheme();
    String type = intent.getType();
    // if (Intent.ACTION_VIEW.equals(action) && scheme.equals("file")) {
    //   String filePath = intent.getDataString();
    //   Plugin.getInstance().getBridge().getEventEmitter().emit("urlSchemeOpen", filePath);
    //   finish();
    // }
    // if (Intent.ACTION_SEND.equals(action) && type != null) {
      bridge.getActivity().setIntent(intent);
      bridge.triggerJSEvent("testintent", "window", "{'dataKey':'dataValue'}");
      // bridge.eval("window.dispatchEvent(new Event('testintent'))", new ValueCallback<String>() {
      //   @Override
      //   public void onReceiveValue(String s) {
      //   }
      // });
    // }

  }

  // @Override
  // protected void onNewIntent(Intent intent) {
  //   super.onNewIntent(intent);
  //   String action = intent.getAction();
  //   String type = intent.getType();
  //   if (Intent.ACTION_SEND.equals(action) && type != null) {
  //     bridge.getActivity().setIntent(intent);
  //     bridge.eval("window.dispatchEvent(new Event('testintent'))", new ValueCallback<String>() {
  //       @Override
  //       public void onReceiveValue(String s) {
  //       }
  //     });
  //   }
  // }
}
