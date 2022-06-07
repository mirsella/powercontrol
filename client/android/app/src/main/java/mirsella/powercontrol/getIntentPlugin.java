package mirsella.powercontrol;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import android.content.Intent;  
import android.net.Uri;

@CapacitorPlugin(name = "getIntentPlugin")
public class getIntentPlugin extends Plugin {

    @PluginMethod
    public void url(PluginCall call) {
        Intent intent = bridge.getActivity().getIntent();
        JSObject ret = new JSObject();
        ret.put("value", intent.getDataString());
        call.resolve(ret);
    }
}

