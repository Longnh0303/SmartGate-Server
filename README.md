### Smart Gate Server

To use socket io

```javascript
const { getIO } = require('./socket.service');
const io = getIO();
io.to("name_of_room").emit("name_of_event", data);
```