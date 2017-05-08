[![Build Status](https://travis-ci.org/aaronlidman/mapview.svg?branch=master)](https://travis-ci.org/aaronlidman/mapview)

# mapview

View mbtiles locally. A quick way to inspect what is in your mbtiles file without having to upload it to a remote service.

```bash
% npm install -g mapview
% export MAPBOX_ACCESS_TOKEN='pk.0000.1111' # a mapbox public token
% mapview ~/roads.mbtiles
```

Type `mapview --help` to see the parameters available.

**Examples**

![awesome 1](https://cloud.githubusercontent.com/assets/58878/15119908/fc49b9b8-15c7-11e6-99b8-8a590df46c37.png)

![awesome 2](https://cloud.githubusercontent.com/assets/58878/15119925/0a974634-15c8-11e6-852b-a7d411cd407f.png)

![awesome 3](https://cloud.githubusercontent.com/assets/58878/15120006/61715756-15c8-11e6-8219-3fb3c8389462.png)

**Why**
- To inspect data locally quicker
- To avoid upload size limitations
- To avoid tile size limitations
