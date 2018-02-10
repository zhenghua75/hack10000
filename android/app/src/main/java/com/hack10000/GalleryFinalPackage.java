package cn.kmdx.hack10000;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import android.content.Intent;
import android.app.Activity;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import android.support.v4.app.FragmentActivity;

public class GalleryFinalPackage implements ReactPackage {
  private final FragmentActivity mMainActivity;
  private GalleryFinalModule mModuleInstance;

  public GalleryFinalPackage(FragmentActivity mainActivity) {
    this.mMainActivity = mainActivity;
  }

  @Override
  public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
    mModuleInstance = new GalleryFinalModule(reactContext,mMainActivity);

    return Arrays.<NativeModule>asList(mModuleInstance);
  }

  @Override
  public List<Class<? extends JavaScriptModule>> createJSModules() {
    return Collections.emptyList();
  }

  @Override
  public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
    return Collections.emptyList();
  }
}