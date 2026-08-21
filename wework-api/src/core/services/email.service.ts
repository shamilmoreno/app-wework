import nodemailer from 'nodemailer';
import { IMail } from '../interfaces/imail';
import { IEnvironment } from './../interfaces/ienvironment';
import { checkEnvironment } from './../middlewares/check-environment';
import { CompanyService } from './company.service';

export class EmailService {
	private transport: any;
	private options: IMail;

	constructor() {
		this.defineTransporter();
	}

	/**
	 * Definición de las opciones del correo electrónico
	 * @param eTo Destinatario
	 * @param eSubject Asunto
	 * @param eHtml Cuerpo
	 */
	public async mailOptions(eTo: string, eSubject: string, eHi: string, eMessage: string): Promise<void> {
		// Valores predeterminados de la empresa
		let name = 'WeWork Integrados';
		let address = 'Torre Galipan';
		let phone = '';
		let website = 'www.weworkintegrados.com';
		let instagram = '';
		let sign = '';

		/* Si decides reactivar la obtención de datos desde el servicio de la empresa
		const companyService = new CompanyService();
		const companyData = await companyService.list();
	
		// Asignar valores de los datos obtenidos dinámicamente
		companyData.forEach((i: any) => {
			switch (i.key) {
				case 'name': name = i.value; break;
				case 'address': address = i.value; break;
				case 'phone': phone = i.value; break;
				case 'website': website = i.value; break;
				case 'instagram': instagram = i.value; break;
				case 'sign': sign = i.value; break;
			}
		});
		*/

		// Opciones del correo
		this.options = {
			from: '"Servicios WeWork Integrados" <info@weworkintegrados.com>', // Remitente
			priority: 'high', // Prioridad del correo
			encoding: 'utf-8', // Codificación del mensaje
			to: eTo, // Destinatario
			subject: `${eSubject} [Grupo. WeWork Integrados]`, // Asunto con prefijo de la empresa
			html: `
				${this.defineStart(name)}
				${this.defineHeader()}
				${this.defineBody(eHi, eMessage)}
				${this.defineFooter(name, address, phone, website, instagram, sign)}
			`, // Contenido HTML del correo
		};

		// Enviar el correo
		this.send(eTo, eSubject);
	}


	/**
	 * Enviar correo electrónico con los datos establecidos
	 */
	private send(to: string, subject: string): void {
		this.transport.sendMail(this.options, (err: any, info: any) => {
			if (err) {
				console.error(`Error al enviar el correo a <${to}>:`, err);
			} else {
				console.log(`Correo electrónico enviado con éxito a <${to}> con asunto: "${subject}". Info adicional:`, info);
			}
		});
	}
	

	/**
	 * Definición de las credenciales de la cuenta
	 */
	private defineTransporter(): void {
		// Loading vars
		const env: IEnvironment = checkEnvironment();

		// Define transporter
		this.transport = nodemailer.createTransport(env.EMAIL_SETTING);
	}

	/**
	 * Definición del inicio
	 */
	private defineStart(name: string) {
		return `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html style="width:100%;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">
      <head>
        <meta charset="UTF-8">
        <meta content="width=device-width, initial-scale=1" name="viewport">
        <meta name="x-apple-disable-message-reformatting">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta content="telephone=no" name="format-detection">
        <title>${name}</title>
        <!--[if (mso 16)]>
        <style type="text/css">
        a {text-decoration: none;}
        </style>
        <![endif]-->
        <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
        <!--[if !mso]><!-- -->
        <link href="https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i" rel="stylesheet">
        <!--<![endif]-->
        <style type="text/css">
          @media only screen and (max-width:600px) {p, ul li, ol li, a { font-size:17px!important; line-height:150%!important } h1 { font-size:30px!important; text-align:center; line-height:120%!important } h2 { font-size:26px!important; text-align:left; line-height:120%!important } h3 { font-size:20px!important; text-align:left; line-height:120%!important } h1 a { font-size:30px!important; text-align:center } h2 a { font-size:20px!important; text-align:left } h3 a { font-size:20px!important; text-align:left } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:17px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:inline-block!important } a.es-button { font-size:14px!important; display:inline-block!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } .es-desk-menu-hidden { display:table-cell!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } }
          #outlook a {
          padding:0;
          }
          .ExternalClass {
          width:100%;
          }
          .ExternalClass,
          .ExternalClass p,
          .ExternalClass span,
          .ExternalClass font,
          .ExternalClass td,
          .ExternalClass div {
          line-height:100%;
          }
          .es-button {
          mso-style-priority:100!important;
          text-decoration:none!important;
          transition:all 100ms ease-in;
          }
          a[x-apple-data-detectors] {
          color:inherit!important;
          text-decoration:none!important;
          font-size:inherit!important;
          font-family:inherit!important;
          font-weight:inherit!important;
          line-height:inherit!important;
          }
          .es-button:hover {
          background:#555555!important;
          border-color:#555555!important;
          }
          .es-desk-hidden {
          display:none;
          float:left;
          overflow:hidden;
          width:0;
          max-height:0;
          line-height:0;
          mso-hide:all;
          }
        </style>
      </head>
      <body style="width:100%;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">
        <div class="es-wrapper-color" style="background-color:#F1F1F1;">
        <!--[if gte mso 9]>
            <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
              <v:fill type="tile" color="#f1f1f1"></v:fill>
            </v:background>
          <![endif]-->
        <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;">
          <tr style="border-collapse:collapse;">
            <td valign="top" style="padding:0;Margin:0;">
    `;
	}

	/**
	 * Definición del header
	 */
	private defineHeader() {
		// Loading vars
		const env: IEnvironment = checkEnvironment();

		// HTML
		return `
      <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;">
      <tr style="border-collapse:collapse;">
      <td align="center" style="padding:0;Margin:0;">
        <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#F7FAFC;" width="600" cellspacing="0" cellpadding="0" bgcolor="#f7fafc" align="center">
          <tr style="border-collapse:collapse;">
          <td align="left" bgcolor="#333333" style="padding:0;Margin:0;padding-top:20px;padding-left:40px;padding-right:40px;background-color:#333333;">
            <!--[if mso]><table width="520" cellpadding="0" cellspacing="0"><tr><td width="250" valign="top"><![endif]-->
            <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;">
              <tr style="border-collapse:collapse;">
              <td width="250" class="es-m-p20b" align="left" style="padding:0;Margin:0;">
                <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                  <tr class="es-mobile-hidden" style="border-collapse:collapse;">
                  <td align="center" style="padding:0;Margin:0;font-size:0px;"><img class="adapt-img" src="${env.NODE_SERVER}/resources/logo-header.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="250" height="119"></td>
                  </tr>
                  <tr class="es-mobile-hidden" style="border-collapse:collapse;">
                  <td align="left" style="padding:0;Margin:0;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:15px;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:23px;color:#555555;"><br></p></td>
                  </tr>
                </table></td>
              </tr>
            </table>
            <!--[if mso]></td><td width="20"></td><td width="250" valign="top"><![endif]-->
            <table cellpadding="0" cellspacing="0" class="es-right" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right;">
              <tr style="border-collapse:collapse;">
              <td width="250" align="left" style="padding:0;Margin:0;">
                <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                  <tr class="es-mobile-hidden" style="border-collapse:collapse;">
                  <td align="left" class="es-m-txt-c" bgcolor="transparent" style="padding:0;Margin:0;"><br><br><span style="font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size:14px;"><strong><span style="line-height:120%;color:#FFFFFF;"GRUPO. WEWORK INTEGRADOS SALAZAR</span></strong><br><strong style="color:#FFFFFF;font-size:14px;text-align:center;">OTORRINOLARINGOLOGÍA</strong><br><strong style="color:#FFFFFF;font-size:14px;text-align:center;">CARACAS, VENEZUELA<br><br></strong></span></td>
                  </tr>
                </table></td>
              </tr>
            </table>
            <!--[if mso]></td></tr></table><![endif]--></td>
          </tr>
    `;
	}

	/**
	 * Estructura del mensaje
	 * @param title Saludo de la persona
	 * @param message Cuerpo del mensaje
	 */
	private defineBody(title: string, message: string) {
		return `
      <tr style="border-collapse:collapse;">
        <td align="left" style="padding:0;Margin:0;padding-top:40px;padding-left:40px;padding-right:40px;">
        <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
          <tr style="border-collapse:collapse;">
            <td width="520" valign="top" align="center" style="padding:0;Margin:0;">
            <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
              <tr style="border-collapse:collapse;">
                <td align="left" style="padding:0;Margin:0;padding-bottom:20px;"><h2 style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size:20px;font-style:normal;font-weight:bold;color:#333333;">${title}</h2></td>
              </tr>
              <tr style="border-collapse:collapse;">
                <td style="padding:0;Margin:0;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:15px;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:23px;color:#555555;text-align:justify;">${message}</p></td>
              </tr>
            </table><br /><br /></td>
          </tr>
        </table></td>
      </tr>
    `;
	}

	/**
	 * Estructura del pie de página
	 * @param name Nombre de la empresa
	 * @param address Dirección de la empresa
	 * @param phone Teléfono de la empresa
	 * @param website Sitio web de la empresa
	 */
	private defineFooter(name: string, address: string, phone: string, website: string, instagram: string, sign: string) {
		// Loading vars
		const env: IEnvironment = checkEnvironment();

		// HTML
		return `
        </table></td>
        </tr>
      </table>
      <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;">
        <tr style="border-collapse:collapse;">
        <td align="center" style="padding:0;Margin:0;">
          <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;" width="600" cellspacing="0" cellpadding="0" align="center">
            <tr style="border-collapse:collapse;">
            <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:40px;padding-right:40px;">
              <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                <tr style="border-collapse:collapse;">
                <td width="520" align="center" valign="top" style="padding:0;Margin:0;">
                  <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                    <tr style="border-collapse:collapse;">
                    <td align="center" style="padding:0;Margin:0;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:12px;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:18px;color:#555555;"><em>No responder este mensaje, es un sistema automático de envío de correos electrónicos.<br></em><br></p></td>
                    </tr>
                  </table></td>
                </tr>
              </table></td>
            </tr>
          </table></td>
        </tr>
      </table>

      <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;">
        <tr style="border-collapse:collapse;">
        <td align="center" style="padding:0;Margin:0;">
          <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#292828;" width="600" cellspacing="0" cellpadding="0" bgcolor="#292828" align="center">
            <tr style="border-collapse:collapse;">
            <td align="left" style="Margin:0;padding-top:30px;padding-bottom:30px;padding-left:40px;padding-right:40px;">
              <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                <tr style="border-collapse:collapse;">
                <td width="520" valign="top" align="center" style="padding:0;Margin:0;">
                  <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                    <tr style="border-collapse:collapse;">
                      <td align="center" style="padding:0;Margin:0;">
                        <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#FFFFFF;">
                          <strong>${name}</strong>
                        </p>
                        <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#FFFFFF;">
                          ${sign}<br>
                          ${address}<br>
                          ${phone}<br><br>
                        </p>
                      </td>
                    </tr>
                    <tr style="border-collapse:collapse;">
                    <td align="center" style="padding:0;Margin:0;font-size:0;">
                      <table class="es-table-not-adapt es-social" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                        <tr style="border-collapse:collapse;">
                          <td valign="top" align="center" style="padding:0;Margin:0;padding-right:10px;"><a target="_blank" href="${instagram}" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size:15px;text-decoration:underline;color:#26A4D3;"><img title="Instagram" src="${env.NODE_SERVER}/resources/instagram.png" alt="Instagram" width="32" height="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td>
                          <td valign="top" align="center" style="padding:0;Margin:0;padding-right:10px;"><a target="_blank" href="${website}" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size:15px;text-decoration:underline;color:#26A4D3;"><img title="Sitio Web" src="${env.NODE_SERVER}/resources/website.png" alt="Sitio Web" width="32" height="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td>
                        </tr>
                      </table></td>
                    </tr>
                  </table></td>
                </tr>
              </table></td>
            </tr>
          </table></td>
        </tr>
      </table>

          </td>
          </tr>
        </table>
      </div>
      </body>
      </html>
    `;
	}
}
