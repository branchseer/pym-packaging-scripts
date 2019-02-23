#!/bin/bash

# Name of your app.
# The path of your app to sign.
APP="Pym"
APP_PATH="../Pym.app"
# The path to the location you want to put the signed package.
RESULT_PATH="../Pym.pkg"
# The name of certificates you requested.
APP_KEY="3rd Party Mac Developer Application: Your Name (ABCD1234EF)"
INSTALLER_KEY="3rd Party Mac Developer Installer: Your Name (ABCD1234EF)"
# The path of your plist files.
CHILD_PLIST="child.plist"
PARENT_PLIST="parent.plist"


# codesign -s "$APP_KEY" -f --entitlements "$PLIST" "$APP_PATH/Electron Framework.framework/Versions/A/Electron Framework"
# codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/Electron Framework.framework/Versions/A/Libraries/libffmpeg.dylib"
# codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/Electron Framework.framework/Versions/A/Libraries/libnode.dylib"
# codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/Electron Framework.framework"
# codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/$APP Helper.app/Contents/MacOS/$APP Helper"
# codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/$APP Helper.app/"
# codesign -s "$APP_KEY" -f --entitlements "$LOGINHELPER_PLIST" "$APP_PATH/Contents/Library/LoginItems/$APP Login Helper.app/Contents/MacOS/$APP Login Helper"
xattr -rc "$APP_PATH"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$APP_PATH/Contents/Resources/node_modules/deskgap/build/Release/deskgap_native.node"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$APP_PATH/Contents/MacOS/$APP"
codesign -s "$APP_KEY" -f --entitlements "$PARENT_PLIST" "$APP_PATH"

productbuild --component "$APP_PATH" /Applications --sign "$INSTALLER_KEY" "$RESULT_PATH"

