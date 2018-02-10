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

import android.widget.Toast;
import android.content.Context;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import cn.finalteam.galleryfinal.CoreConfig;
import cn.finalteam.galleryfinal.FunctionConfig;
import cn.finalteam.galleryfinal.GalleryFinal;
import cn.finalteam.galleryfinal.PauseOnScrollListener;
import cn.finalteam.galleryfinal.ThemeConfig;
import cn.finalteam.galleryfinal.model.PhotoInfo;

import com.baoyz.actionsheet.ActionSheet;
import android.support.v4.app.FragmentActivity;

import java.util.ArrayList;
import java.util.List;
import java.io.File;

import com.nostra13.universalimageloader.cache.disc.naming.Md5FileNameGenerator;
import com.nostra13.universalimageloader.core.ImageLoader;
import com.nostra13.universalimageloader.core.ImageLoaderConfiguration;
import com.nostra13.universalimageloader.core.assist.QueueProcessingType;

import java.io.IOException;
import java.io.InputStream;
import java.io.FileInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;

public class GalleryFinalModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext mReactContext;
  private final FragmentActivity mMainActivity;
  private Callback mCallBack;
  private final int REQUEST_CODE_CAMERA = 1000;
  private final int REQUEST_CODE_GALLERY = 1001;
  private List<PhotoInfo> mPhotoList;

  private int maxWidth = 0;
  private int maxHeight = 0;
  private int quality = 100;
  private boolean square = false;
  private boolean crop = false;
  private boolean forceCrop = false;
  private boolean edit = false;
  private boolean forceCropEdit = false;
  private boolean camera = false;
  private boolean preview = false;

  public GalleryFinalModule(ReactApplicationContext reactContext,FragmentActivity mainActivity) {
    super(reactContext);
    mReactContext = reactContext;
    mMainActivity = mainActivity;
  }

  @Override
  public String getName() {
    return "GalleryFinal";
  }

  @ReactMethod
  public void show(final ReadableMap options,Callback callback) {
    mCallBack = callback;
    if (options.hasKey("maxWidth")) {
        maxWidth = options.getInt("maxWidth");
    }
    if (options.hasKey("maxHeight")) {
        maxHeight = options.getInt("maxHeight");
    }
    if (options.hasKey("quality")) {
        quality = (int)(options.getDouble("quality") * 100);
    }
    if(options.hasKey("square")){
        square = options.getBoolean("square");
    }
    if(options.hasKey("crop")){
        crop = options.getBoolean("crop");
    }
    if(options.hasKey("forceCrop")){
        forceCrop = options.getBoolean("forceCrop");
    }
    if(options.hasKey("edit")){
        edit = options.getBoolean("edit"); 
    }
    if(options.hasKey("forceCropEdit")){
        forceCropEdit = options.getBoolean("forceCropEdit");
    }
    if(options.hasKey("camera")){
        camera = options.getBoolean("camera");
    }
    if(options.hasKey("preview")){
        camera = options.getBoolean("preview");
    }
    ThemeConfig themeConfig = ThemeConfig.DARK;

    FunctionConfig.Builder functionConfigBuilder = new FunctionConfig.Builder();
    cn.finalteam.galleryfinal.ImageLoader imageLoader = new UILImageLoader();
    PauseOnScrollListener pauseOnScrollListener = new UILPauseOnScrollListener(false, true);

    functionConfigBuilder.setEnableEdit(edit);
    functionConfigBuilder.setForceCropEdit(forceCropEdit);
    functionConfigBuilder.setCropSquare(square);
    functionConfigBuilder.setEnableCrop(crop);
    functionConfigBuilder.setForceCrop(forceCrop);

    if(maxWidth>0){
      functionConfigBuilder.setCropWidth(maxWidth);
    }

    if(maxHeight>0){
      functionConfigBuilder.setCropHeight(maxHeight);
    }

    functionConfigBuilder.setEnableCamera(camera);
    functionConfigBuilder.setEnablePreview(preview);
    mPhotoList = new ArrayList<>();
    functionConfigBuilder.setSelected(mPhotoList);//添加过滤集合
    final FunctionConfig functionConfig = functionConfigBuilder.build();

    CoreConfig coreConfig = new CoreConfig.Builder(mMainActivity, imageLoader, themeConfig)
                        .setDebug(BuildConfig.DEBUG)
                        .setFunctionConfig(functionConfig)
                        .setPauseOnScrollListener(pauseOnScrollListener)
                        .setTakePhotoFolder(new File(Environment.getExternalStorageDirectory(), "/DCIM/" + "Hack10000/"))
                        .setEditPhotoCacheFolder(new File(Environment.getExternalStorageDirectory() + "/Hack10000/edittemp/"))
                        .build();
    GalleryFinal.init(coreConfig);
    initImageLoader(mMainActivity);
    ActionSheet.createBuilder(mMainActivity, mMainActivity.getSupportFragmentManager())
                        .setCancelButtonTitle("取消(Cancel)")
                        .setOtherButtonTitles("打开相册(Open Gallery)", "拍照(Camera)")
                        .setCancelableOnTouchOutside(true)
                        .setListener(new ActionSheet.ActionSheetListener() {
                            @Override
                            public void onDismiss(ActionSheet actionSheet, boolean isCancel) {

                            }

                            @Override
                            public void onOtherButtonClick(ActionSheet actionSheet, int index) {
                                switch (index) {
                                    case 0:
                                        GalleryFinal.openGallerySingle(REQUEST_CODE_GALLERY, functionConfig, mOnHanlderResultCallback);
                                        break;
                                    case 1:
                                        GalleryFinal.openCamera(REQUEST_CODE_CAMERA, functionConfig, mOnHanlderResultCallback);
                                        break;
                                    default:
                                        break;
                                }
                            }
                        })
                        .show();

  }

  private void initImageLoader(Context context) {
      ImageLoaderConfiguration.Builder config = new ImageLoaderConfiguration.Builder(context);
      config.threadPriority(Thread.NORM_PRIORITY - 2);
      config.denyCacheImageMultipleSizesInMemory();
      config.diskCacheFileNameGenerator(new Md5FileNameGenerator());
      config.diskCacheSize(50 * 1024 * 1024); // 50 MiB
      config.tasksProcessingOrder(QueueProcessingType.LIFO);
      ImageLoader.getInstance().init(config.build());
  }

  private GalleryFinal.OnHanlderResultCallback mOnHanlderResultCallback = new GalleryFinal.OnHanlderResultCallback() {
      @Override
      public void onHanlderSuccess(int reqeustCode, List<PhotoInfo> resultList) {
          if (resultList != null) {
              PhotoInfo pi = resultList.get(0);
               String data = null;
              if (maxWidth == 0 && maxHeight == 0 && quality == 100) {
                   data = getBase64StringFromFile(pi.getPhotoPath());
              } else {
                   data = getBase64StringFromResizeImage(pi.getPhotoPath());
              }
              mCallBack.invoke(data);
          }
      }

      @Override
      public void onHanlderFailure(int requestCode, String errorMsg) {
          Toast.makeText(mMainActivity, errorMsg, Toast.LENGTH_SHORT).show();
      }
  };
  private String getBase64StringFromFile (String absoluteFilePath) {
    InputStream inputStream = null;
    try {
      inputStream = new FileInputStream(absoluteFilePath);
    } catch (FileNotFoundException e) {
        e.printStackTrace();
    }

    byte[] bytes;
    byte[] buffer = new byte[8192];
    int bytesRead;
    ByteArrayOutputStream output = new ByteArrayOutputStream();
    try {
        while ((bytesRead = inputStream.read(buffer)) != -1) {
            output.write(buffer, 0, bytesRead);
        }
    } catch (IOException e) {
        e.printStackTrace();
    }
    bytes = output.toByteArray();
    return Base64.encodeToString(bytes, Base64.NO_WRAP);
  }
  private String getBase64StringFromResizeImage (final String realPath) {
    final BitmapFactory.Options options = new BitmapFactory.Options();
    options.inJustDecodeBounds = true;
    Bitmap photo = BitmapFactory.decodeFile(realPath, options);
    options.inJustDecodeBounds = false;
    int initialWidth = options.outWidth;
    int initialHeight = options.outHeight;

    int be = 1;  
    if (initialWidth > initialHeight && initialWidth > maxWidth && maxWidth>0) {  
        be = (int) (initialWidth / (float)maxWidth);  
    } else if (initialWidth < initialHeight && initialHeight > maxHeight && maxHeight>0) {  
        be = (int) (initialHeight / (float)maxHeight);  
    }  
    if (be <= 0)  
        be = 1; 

    options.inSampleSize = be;
    photo = BitmapFactory.decodeFile(realPath, options);

    ByteArrayOutputStream bytes = new ByteArrayOutputStream();
    photo.compress(Bitmap.CompressFormat.JPEG, quality, bytes);
    String data = Base64.encodeToString(bytes.toByteArray(), Base64.NO_WRAP);
    if (photo != null) {
        photo.recycle();
        photo = null;
    }
    return data;
  }
   
}
