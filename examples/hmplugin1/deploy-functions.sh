echo "Compiling functions..."
npm run build

echo "Copying wasm file to the plugin directory..."
cp build/debug.wasm ~/plugins/debug.wasm

echo "Done!"
