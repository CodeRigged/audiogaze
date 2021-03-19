import net from 'net';
import config from '../../config';

export default class EyetrackerService {
  client = new net.Socket();
  connected = false;
  timestamp = null;
  dataVariables = [
    {
      id: 'fixationCoordinates',
      enabler: 'ENABLE_SEND_POG_FIX',
    },
    {id: 'leftEyeCoordinates', enabler: 'ENABLE_SEND_POG_LEFT'},
    {id: 'rightEyeCoordinates', enabler: 'ENABLE_SEND_POG_RIGHT'},
    {id: 'pupilDiameter', enabler: 'ENABLE_SEND_PUPILMM'},
  ];
  constructor() {
    this.startService();
    this.timestamp = new Date();
  }

  startService() {
    this.client.setEncoding('utf-8');
    this.client.setTimeout(5000, () => {
      console.log('Ended Gazepoint eyetracker [timeout].');
    });
  }

  connectToEyeTracker(options) {
    this.client.connect({
      host: config.HOST,
      port: config.GAZEPOINT_PORT,
    });
    return new Promise((resolve, reject) => {
      this.client.on('connect', () => {
        // Send message to Gazepoint API server to enable data
        this.client.write('<SET ID="ENABLE_SEND_DATA" STATE="1" />\r\n');

        if (options) {
          this.dataVariables.forEach((dataVariables) => {
            if (options.includes(dataVariables.id)) {
              this.client.write(
                `<SET ID="${dataVariables.enabler}" STATE="1" />\r\n`,
              );
            }
          });
        } else {
          this.dataVariables.forEach((dataVariables) => {
            this.client.write(
              `<SET ID="${dataVariables.enabler}" STATE="1" />\r\n`,
            );
          });
        }
        resolve(true);
      });
      this.client.on('error', function (err) {
        reject(false);
      });
    });
  }

  getScreenSize() {
    this.client.write('<SET ID="ENABLE_SEND_DATA" STATE="1" />\r\n');
  }

  listenToDataStream() {
    this.client.on('data', (data) => {
      console.log(data);
    });
  }

  disableDataStream() {
    this.client.destroy((e) => {
      console.log(e);
    });
  }

  enableSelectedDataStream(variables) {
    this.client.on('connect', () => {
      console.log('Connected with Gazepoint API server');
      // Send message to Gazepoint API server to enable data
      this.client.write('<SET ID="ENABLE_SEND_DATA" STATE="1" />\r\n');
      this.dataVariables.forEach((dataVariables) => {});
    });
  }
}
