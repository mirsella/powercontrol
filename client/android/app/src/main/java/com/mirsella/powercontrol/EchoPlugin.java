package com.mirsella.powercontrol;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import android.net.wifi.WifiManager;

@CapacitorPlugin(name = "Echo")
public class EchoPlugin extends Plugin {

  @PluginMethod()
  public void echo(PluginCall call) {
    String value = call.getString("value");

    WifiManager wifiManager = (WifiManager) getApplicationContext().getSystemService(WIFI_SERVICE);
    String ipAddress = wifiManager.getConnectionInfo().getIpAddress();

    JSObject ret = new JSObject();
    ret.put("value", ipAddress);
    call.resolve(ret);
  }
}
