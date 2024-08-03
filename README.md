
# Project Title

React- Native app 

# Setup
Clone the repository and install the dependencies

git clone <repository>

run the below stqewps to install dependencies

--npm install

Start the frontend application locally

--npm/npx start 

or

--npx expo start --web


# How to Generate apk

on local machine
-----------------
1.On Windows keytool must be run from C:\Program Files\Java\jdkx.x.x_x\bin, as administrator.

keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000

2.Setting up Gradle variables
Place the my-upload-key.keystore file under the android/app directory in your project folder.
Edit the file ~/.gradle/gradle.properties or android/gradle.properties, and add the following (replace ***** with the correct keystore password, alias and key password),

MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=*****
MYAPP_UPLOAD_KEY_PASSWORD=*****

3.Adding signing config to your app's Gradle config
The last configuration step that needs to be done is to setup release builds to be signed using upload key. Edit the file android/app/build.gradle in your project folder, and add the signing config,


...
android {
    ...
    defaultConfig { ... }
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
}
...

4.once the setup is done 

cd android

./gradlew assembleRelease 

reference-

https://reactnative.dev/docs/signed-apk-android

https://www.youtube.com/watch?v=y7Q5OMZjIsE

Using expo
-----------

step 1 - npm  instal -g eas-cli

step 2 - eas build -p android  --once eas.json generated ,stop the build with ctrl+c
go to https://docs.expo.dev/build-reference/apk  --modify eas.json build section --add previews only

Step3- eas build -p android --profile preview

reference-https://www.youtube.com/watch?v=9Y-jir-RlKQ

https://docs.expo.dev/build-reference