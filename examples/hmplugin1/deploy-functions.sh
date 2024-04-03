echo "Compiling functions..."
npm run build

echo "Copying wasm file to the plugin directory..."
cp build/*.wasm ~/.hypermode/
cp hypermode.json ~/.hypermode/hypermode.json
echo "Done!"
