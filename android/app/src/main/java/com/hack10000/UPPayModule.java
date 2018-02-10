package cn.kmdx.hack10000;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;
import android.database.Cursor;
import android.util.Base64;
import android.app.AlertDialog;
import android.widget.ArrayAdapter;
import android.content.DialogInterface;
import android.graphics.BitmapFactory;
import android.graphics.Bitmap;
import android.media.ExifInterface;
import android.content.ComponentName;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import com.unionpay.UPPayAssistEx;
import com.unionpay.uppay.PayActivity;

public class UPPayModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext mReactContext;
  private final Activity mMainActivity;
  private Callback mCallBack;

  public UPPayModule(ReactApplicationContext reactContext,Activity mainActivity) {
    super(reactContext);
    mReactContext = reactContext;
    mMainActivity = mainActivity;
  }

  @Override
  public String getName() {
    return "UPPay";
  }

  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    if (data == null) {
        return;
    }
    String str = data.getExtras().getString("pay_result");
    mCallBack.invoke(str);
  }

  @ReactMethod
  public void startPay(String tn,Callback callback) {
    mCallBack = callback;
    //UPPayAssistEx.startPay(mMainActivity, null, null, tn, "01");
    try{
      UPPayAssistEx.startPayByJAR (mMainActivity, PayActivity.class, null, null, tn, "00");
    }catch(Exception e){
      throw e;
    }
  }
}
