package mirsella.powercontrol;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import com.getcapacitor.bridge;

import android.content.Intent;  

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
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
