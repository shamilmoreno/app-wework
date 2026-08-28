import fs from 'fs';
import path from 'path';
import messages from './../helpers/messages';
import { IEnvironment } from './../interfaces/ienvironment';
import { checkEnvironment } from './../middlewares/check-environment';

export class UploadService {
  private folder: string = './public/images';

  public async upload(imageToUpload: string, nameToUpload: string): Promise<string> {
    try {
      // Vars
      let result: any = '';
      let ext: string = '';
      const response: any = {};

      // Check environment
      const env: IEnvironment = checkEnvironment();

      // Valid image
      const matches = imageToUpload.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

      // Verify if send to image
      if (matches.length === 3) {
        response.type = matches[1];
        response.data = Buffer.from(matches[2], 'base64');
        fs.mkdirSync(this.folder, { recursive: true });

        // Define the extension
        switch (response.type) {
          case 'image/jpeg': case 'image/jpeg': ext = '.jpg'; break;
          case 'image/gif': ext = '.gif'; break;
          case 'image/png': ext = '.png'; break;
        }

        // Define file name
        const pathToFile: string = path.join(__dirname, '../../../public/images', nameToUpload + ext);
        const pathToServer: string = `${ env.NODE_SERVER }/images/${ nameToUpload + ext }`;

        // Save file
        fs.writeFileSync(pathToFile, response.data);
        result = pathToServer;
      } else {
        result = messages.upload.imageNotFound;
      }

      // Return result
      return result;
    } catch (error) {
      return messages.general.error;
    }
  }

  public async remove(nameToDelete: string) {
    try {
      // Vars
      const path = `${ this.folder }/${ nameToDelete }`;

      // Delete file
      fs.unlinkSync(path);
      return true;
    } catch (error) {
      return messages.general.error;
    }
  }
}
