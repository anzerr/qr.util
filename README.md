
### `Intro`
![GitHub Actions status | linter](https://github.com/anzerr/qr.util/workflows/linter/badge.svg)
![GitHub Actions status | publish](https://github.com/anzerr/qr.util/workflows/publish/badge.svg)
![GitHub Actions status | test](https://github.com/anzerr/qr.util/workflows/test/badge.svg)

Create QR codes as matrix array, console printable svg or base64 svg image

#### `Install`
``` bash
npm install --save git+https://github.com/anzerr/qr.util.git
npm install --save @anzerr/qr.util
```

### `Example`
``` javascript
const Qr = require('qr.util'),
	fs = require('fs');

let qr = new Qr('cat');
console.log(qr.toString());
console.log(qr.toArray());
console.log(qr.toConsole());
console.log(qr.toSvg());
fs.writeFileSync('qr.svg', qr.toSvg());
fs.writeFileSync('qr.html', `<div style="width:256px;height:256px">${qr.toSvg({html: true})}</div>`);

```