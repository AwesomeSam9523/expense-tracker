# Building this app

To build this app you need `eas`.\
Run the following command to build the app:

```bash
npm install -g eas-cli
```

After that run the following to login

```bash
eas login
```

Once you are logged in, run the following command to build the app:

```bash
npm run build
```

This will create a `.aab` (Android App Bundle) file.
To then create an `APK`, you must have Java installed and have [`bundletool`](https://github.com/google/bundletool/releases).\
Download the `.aab` file and run the following command:

```bash
java -jar bundletool-all-1.17.1.jar build-apks --bundle=bundle.aab --output=cstijori.apks --mode=universal
```

Once this is done, rename the `.apks` to `.zip` and extract it.\
You will find the required `APK` file in the extracted folder. This APK is ready to be installed on any Android device.
