import net from 'net';
import config from '../../config';

/**
 * @description Service which handles all related actions with Gazepoint eye-tracker
 */
class EyetrackerService {
  connected = false;
  data = [];
  client = new net.Socket();
  dataVariables = [
    {
      id: 'fixationCoordinates',
      enabler: 'ENABLE_SEND_POG_FIX',
    },
    {id: 'leftEyeCoordinates', enabler: 'ENABLE_SEND_POG_LEFT'},
    {id: 'rightEyeCoordinates', enabler: 'ENABLE_SEND_POG_RIGHT'},
    {id: 'pupilDiameter', enabler: 'ENABLE_SEND_PUPILMM'},
  ];

  connect(options) {
    return new Promise((resolve, reject) => {
      this.client = new net.Socket();
      this.client.setEncoding('utf-8');
      this.client.setTimeout(25000, () => {
        reject(false);
        console.log('Ended Gazepoint eyetracker [timeout].');
      });

      this.client.connect({
        host: config.GAZEPOINT_ADDRESS,
        port: config.GAZEPOINT_PORT,
      });
      this.client.on('connect', () => {
        console.log('Gazepoint eyetracker connected.');
        this.connected = true;
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
      this.client.on('error', (err) => {
        console.log(err);
        reject(false);
      });
    });
  }

  listenToDataStream() {
    this.client.on('data', (data) => {
      data = data.trim();
      if (data.startsWith('<') && data.endsWith('>')) {
        this.data.push({timestamp: Date.now(), data});
      } else {
        console.log('Error');
      }
    });
  }

  disconnect() {
    this.client.end();
    this.client.on('close', () => {
      this.connected = false;
      this.data = [];
      console.log('Gazepoint eyetracker disconnected.');
    });
  }
}
export default new EyetrackerService();
