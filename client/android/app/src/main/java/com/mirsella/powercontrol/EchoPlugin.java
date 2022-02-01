package com.mirsella.powercontrol;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

// import android.net.ConnectivityManager;
// import android.net.NetworkInfo;
// import android.net.wifi.WifiManager;
// import android.content.Context;

@CapacitorPlugin(name = "Echo")
public class EchoPlugin extends Plugin {

  // ConnectivityManager connectivity = (ConnectivityManager)getSystemService(Context.CONNECTIVITY_SERVICE);
  // Network[] networks = connectivity.getAllNetworks();
  // for (int i = 0; i < networks.length; i++) {
  //   NetworkCapabilities capabilities = connectivity.getNetworkCapabilities(networks[i]);    
  // }

  @PluginMethod()
  public void echo(PluginCall call) {
    String value = call.getString("value");

    JSObject ret = new JSObject();
    ret.put("value", value + " " + output);
    call.resolve(ret);
  }
}
