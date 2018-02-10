package cn.kmdx.hack10000;

import android.app.Activity;
import android.os.Bundle;
import android.view.KeyEvent;

import com.facebook.react.LifecycleState;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.eguma.barcodescanner.BarcodeScanner;

import com.umeng.update.UmengUpdateAgent;
import com.umeng.message.PushAgent;
import com.umeng.analytics.MobclickAgent;

import com.burnweb.rnwebview.RNWebViewPackage;

import android.content.Intent;
import com.imagepicker.ImagePickerPackage; 

import me.nucleartux.date.ReactDatePackage;

import android.support.v4.app.FragmentActivity;

//public class MainActivity extends Activity implements DefaultHardwareBackBtnHandler {
public class MainActivity extends FragmentActivity implements DefaultHardwareBackBtnHandler { // ! extends from FragmentActivity
    
    private ReactInstanceManager mReactInstanceManager;
    private ReactRootView mReactRootView;
    // declare package
    private ImagePickerPackage mImagePicker;
    private UPPayPackage mUPPayPackage;
    private GalleryFinalPackage mGalleryFinalPackage;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        UmengUpdateAgent.setUpdateOnlyWifi(false);
        UmengUpdateAgent.update(this);
        PushAgent mPushAgent = PushAgent.getInstance(this);
        mPushAgent.enable();
        PushAgent.getInstance(this).onAppStart();

        //mReactRootView = new ReactRootView(this);
        setContentView(R.layout.activity_main);

        // instantiate package
        mImagePicker = new ImagePickerPackage(this);
        mUPPayPackage = new UPPayPackage(this);
        mGalleryFinalPackage = new GalleryFinalPackage(this);

        mReactInstanceManager = ReactInstanceManager.builder()
                .setApplication(getApplication())
                .setBundleAssetName("index.android.bundle")
                .setJSMainModuleName("index.android")
                .addPackage(new MainReactPackage())
                .addPackage(new BarcodeScanner())
                .addPackage(new RNWebViewPackage())
                .addPackage(mImagePicker)
                .addPackage(new ReactDatePackage(this))
                .addPackage(mUPPayPackage)
                .addPackage(mGalleryFinalPackage)
                .setUseDeveloperSupport(BuildConfig.DEBUG)
                .setInitialLifecycleState(LifecycleState.RESUMED)
                .build();

        // mReactRootView.startReactApplication(mReactInstanceManager, "hack10000", null);

        // setContentView(mReactRootView);
        ((ReactRootView) findViewById(R.id.react_root_view))
        .startReactApplication(mReactInstanceManager, "hack10000", null);
    }
    @Override
    public void onActivityResult(final int requestCode, final int resultCode, final Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        mImagePicker.handleActivityResult(requestCode, resultCode, data);

        mUPPayPackage.handleActivityResult(requestCode, resultCode, data);

    }
    
    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_MENU && mReactInstanceManager != null) {
            mReactInstanceManager.showDevOptionsDialog();
            return true;
        }
        return super.onKeyUp(keyCode, event);
    }

    @Override
    public void onBackPressed() {
      if (mReactInstanceManager != null) {
        mReactInstanceManager.onBackPressed();
      } else {
        super.onBackPressed();
      }
    }

    @Override
    public void invokeDefaultOnBackPressed() {
      super.onBackPressed();
    }

    @Override
    protected void onPause() {
        super.onPause();
        MobclickAgent.onPause(this);
        if (mReactInstanceManager != null) {
            mReactInstanceManager.onPause();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        MobclickAgent.onResume(this);
        if (mReactInstanceManager != null) {
            mReactInstanceManager.onResume(this, this);
        }
    }
}
