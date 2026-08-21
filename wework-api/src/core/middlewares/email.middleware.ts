import { IEnvironment } from './../interfaces/ienvironment';
import { IMailStructure } from './../interfaces/imail-structure';
import { EmailService } from './../services/email.service';
import { checkEnvironment } from './check-environment';

export class EmailMiddleware {
  private emailService = new EmailService();

  /**
   * Envío de enlace para restablecer su contraseña
   * @to Doctor
   * @module Seguridad
   * @param info Información necesaria para el correo electrónico
   */
  public sendRequestToChangePassword(info: IMailStructure) {
    this.emailService.mailOptions(
      info.to,
      'Solicitud de cambio de contraseña',
      `Hola ${ info.data.doctorName }`,
      `
        Has solicitado cambiar tu contraseña a través de nuestra aplicación web. Para completar el proceso, utiliza el siguiente enlace <a href="${ info.data.route }/auth/validate/${ info.data.token }" target="_blank">enlace</a>.
      `,
    );
  }

  /**
   * Envío de notificación de cambio de contraseña
   * @to Doctor
   * @module Seguridad
   * @param info Información necesaria para el correo electrónico
   */
  public sendChangePassword(info: IMailStructure) {
    this.emailService.mailOptions(
      info.to,
      'Cambio de contraseña exitosa',
      `Hola ${ info.data.doctorName }`,
      `Tu contraseña ha sido actualizada con éxito a través de la aplicación web.`,
    );
  }
  
  /**
   * Envío de notificación al doctor sobre el envío del presupuesto al paciente
   * @to Doctor
   * @module Presupuestos
   * @param info Información necesaria para el correo electrónico
   */
  public sendBudgetToDoctor(info: IMailStructure) {
    this.emailService.mailOptions(
      info.to,
      `Presupuesto enviado a ${ info.data.patient }`,
      `Hola ${ info.data.doctorName }`,
      `El presupuesto <b>${ info.data.budgetName }</b> fue enviado al paciente <b>${ info.data.patient }</b>. Para más información inicia sesión en la aplicación web.`,
    );
  }

  /**
   * Envío de cancelación del presupuesto al paciente
   * @to Paciente
   * @module Presupuestos
   * @param info Información necesaria para el correo electrónico
   */
  public sendBudgetCanceledToPatient(info: IMailStructure) {
    // Loading vars
    const env: IEnvironment = checkEnvironment();

    // Build message
    this.emailService.mailOptions(
      (process.env.EMAIL_PATIENT || env.EMAIL_PATIENT || info.to),
      `Se ha eliminado el presupuesto ${ info.data.budgetName }`,
      `Hola ${ info.data.patientName }`,
      `El presupuesto <b>${ info.data.budgetName }</b> fue eliminado, para más información contacte con el equipo del Dr. Froilán a través de los datos disponibles en la firma del presente correo electrónico.`,
    );
  }

  /**
   * Envío de cancelación del presupuesto al doctor
   * @to Doctor
   * @module Presupuestos
   * @param info Información necesaria para el correo electrónico
   */
  public sendBudgetCanceledToDoctor(info: IMailStructure) {
    this.emailService.mailOptions(
      info.to,
      `Se ha eliminado el presupuesto asignado a ${ info.data.patient }`,
      `Hola ${ info.data.doctorName }`,
      `El presupuesto <b>${ info.data.budgetName }</b> asignado al paciente <b>${ info.data.patient }</b> fue eliminado. Para más información inicia sesión en la aplicación web.`,
    );
  }

  /**
   * Envío de pago del presupuesto al paciente
   * @to Paciente
   * @module Presupuestos
   * @param info Información necesaria para el correo electrónico
   */
  public sendBudgetPayToPatient(info: IMailStructure) {
    // Loading vars
    const env: IEnvironment = checkEnvironment();

    // Build message
    this.emailService.mailOptions(
      (process.env.EMAIL_PATIENT || env.EMAIL_PATIENT || info.to),
      `Pagado el presupuesto ${ info.data.budgetName }`,
      `Hola ${ info.data.patientName }`,
      `Has realizado el pago del presupuesto <b>${ info.data.budgetName }</b> con éxito.`,
    );
  }

  /**
   * Envío de pago del presupuesto al doctor
   * @to Doctor
   * @module Presupuestos
   * @param info Información necesaria para el correo electrónico
   */
  public sendBudgetPayToDoctor(info: IMailStructure) {
    this.emailService.mailOptions(
      info.to,
      `Pagado el presupuesto asignado a ${ info.data.patient }`,
      `Hola ${ info.data.doctorName }`,
      `El presupuesto <b>${ info.data.budgetName }</b> asignado al paciente <b>${ info.data.patient }</b> fue pagado. Para más información inicia sesión en la aplicación web.`,
    );
  }

  /**
   * Envío cuando se elimina la consulta en línea del sistema
   * @to Paciente
   * @module Consultas
   * @param info Información necesaria para el correo electrónico
   */
  public sendMedicalQueryDeleteToPatient(info: IMailStructure) {
    // Loading vars
    const env: IEnvironment = checkEnvironment();

    // Build message
    this.emailService.mailOptions(
      (process.env.EMAIL_PATIENT || env.EMAIL_PATIENT || info.to),
      `Tu consulta en línea ha sido eliminada`,
      `Hola ${ info.data.patientName }`,
      `Tu consulta en línea fue eliminada de nuestra plataforma, para más información contacte con el equipo del Dr. Froilán a través de los datos disponibles en la firma del presente correo electrónico.`,
    );
  }

  /**
   * Envío cuando se elimina la consulta en línea del sistema
   * @to Doctor
   * @module Consultas
   * @param info Información necesaria para el correo electrónico
   */
  public sendMedicalQueryDeleteToDoctor(info: IMailStructure) {
    this.emailService.mailOptions(
      info.to,
      `Anulación de consulta en línea paciente ${ info.data.patient }`,
      `Hola ${ info.data.doctorName }`,
      `La consulta en línea asignada al paciente <b>${ info.data.patient }</b> fue eliminada con éxito. Para más información inicia sesión en la aplicación web.`,
    );
  }

  /**
   * Envío del Informe médico preliminar al paciente (No es apto para cirugía)
   * @to Paciente
   * @module Consultas
   * @param info Información necesaria para el correo electrónico
   */
  public sendMedicalQueryDiagnosisToPatient(info: IMailStructure) {
    // Loading vars
    const env: IEnvironment = checkEnvironment();

    // Elements
    let elementsFront = '';
    info.data.diagnosisFront.forEach((i: string) => { elementsFront += '<li>' + i + '</li>'; });

    // Elements
    let elementsBase = '';
    info.data.diagnosisBase.forEach((i: string) => { elementsBase += '<li>' + i + '</li>'; });

    // Elements
    let elementsProfile = '';
    info.data.diagnosisProfile.forEach((i: string) => { elementsProfile += '<li>' + i + '</li>'; });

    // Elements
    let elementsCustom = '';
    info.data.diagnosisCustom.forEach((i: string) => { elementsCustom += '<li>' + i + '</li>'; });

    // Build email
    this.emailService.mailOptions(
      (process.env.EMAIL_PATIENT || env.EMAIL_PATIENT || info.to),
      `Informe Médico Preliminar`,
      `Hola ${ info.data.patientName }`,
      `
        <p>A continuación te detallo el <b>Informe Médico Preliminar</b> obtenido a través de tu análisis físico fotográfico:</p>
        <br/>
        <b>VISTA DE FRENTE:</b>
        <ul>${ elementsFront }</ul>
        <p>${ info.data.commentFront }</p>
        <br/>
        <b>VISTA DE BASE:</b>
        <ul>${ elementsBase }</ul>
        <p>${ info.data.commentBase }</p>
        <br/>
        <b>VISTA DE PERFIL:</b>
        <ul>${ elementsProfile }</ul>
        <p>${ info.data.commentProfile }</p>
        <br/>
        <b>VISTA PERSONALIZADA:</b>
        <ul>${ elementsCustom }</ul>
        <p>${ info.data.commentCustom }</p>
        <br/>
        <b>IMPRESIÓN DIAGNÓSTICA:</b>
        <p>${ info.data.diagnosticImpression }</p>
        <br/>
        <b>CONDUCTA:</b>
        <p>${ info.data.conduct }</p>
        <br/>
        <p><b>${ (info.data.isReadyForSurgery) ? '' : 'NO ES APTO PARA CIRUGÍA' }</b></p>
        <p><b>FECHA: ${ info.data.currentDate }</b></p>

        <img class="patient-img" src="${ info.data.front }" />
        <img class="patient-img" src="${ info.data.base }" />
        <img class="patient-img" src="${ info.data.profile }" />
        <img class="patient-img" src="${ info.data.custom }" />

        <style>
          .patient-img {
            width: 245px;
            height: 245px;
            border-radius: 5%;
            padding: 5px;
            display: inline-block;
          }
        </style>
      `,
    );
  }

  /**
   * Envío del Informe médico preliminar al paciente (No es apto para cirugía)
   * @to Doctor
   * @module Consultas
   * @param info Información necesaria para el correo electrónico
   */
  public sendMedicalQueryDiagnosisToDoctor(info: IMailStructure) {
    this.emailService.mailOptions(
      info.to,
      `Diagnóstico enviado al paciente ${ info.data.patient }`,
      `Hola ${ info.data.doctorName }`,
      `El <b>Informe Médico Preliminar</b> fue enviado al paciente <b>${ info.data.patient }</b> con éxito. Para más información inicia sesión en la aplicación web.`,
    );
  }

  /**
   * Envío de pago de la consulta en línea al paciente
   * @to Paciente
   * @module Consultas
   * @param info Información necesaria para el correo electrónico
   */
  public sendMedicalQueryPayToPatient(info: IMailStructure) {
    // Loading vars
    const env: IEnvironment = checkEnvironment();

    // Build message
    this.emailService.mailOptions(
      (process.env.EMAIL_PATIENT || env.EMAIL_PATIENT || info.to),
      `Pagada consulta en línea`,
      `Hola ${ info.data.patientName }`,
      `Has realizado el pago de tu consulta en línea con el Dr. Froilán Páez con éxito.`,
    );
  }

  /**
   * Envío de pago de la consulta en línea al doctor
   * @to Doctor
   * @module Consultas
   * @param info Información necesaria para el correo electrónico
   */
  public sendMedicalQueryPayToDoctor(info: IMailStructure) {
    this.emailService.mailOptions(
      info.to,
      `Pagada consulta en línea del paciente ${ info.data.patient }`,
      `Hola ${ info.data.doctorName }`,
      `El paciente <b>${ info.data.patient }</b> pagó una consulta en línea. Para más información inicia sesión en la aplicación web.`,
    );
  }

  /**
   * Envío de la creación de la cita en el calendario
   * @to Paciente
   * @module Calendario
   * @param info Información necesaria para el correo electrónico
   */
  public sendScheduleNewToPatient(info: IMailStructure) {
    // Loading vars
    const env: IEnvironment = checkEnvironment();

    // Build message
    this.emailService.mailOptions(
      (process.env.EMAIL_PATIENT || env.EMAIL_PATIENT || info.to),
      'Nueva cita',
      `Hola ${ info.data.patientName }`,
      `
        Tienes una nueva cita con el Dr. Froilán el día <b>${ info.data.date }</b> de <b>${ info.data.timeStart }</b> a <b>${ info.data.timeEnd }</b> con motivo de <b>${ info.data.motive }</b>.
        <br/><br/>
        Recuerda llegar a las <b>8:00 am</b> al consultorio y pronto serás contáctado/a por el equipo del Dr. Froilán Páez para coordinar los detalles.
      `,
    );
  }

  /**
   * Envío de la creación de la cita en el calendario
   * @to Doctor
   * @module Calendario
   * @param info Información necesaria para el correo electrónico
   */
  public sendScheduleNewToDoctor(info: IMailStructure) {
    this.emailService.mailOptions(
      info.to,
      `Nueva cita con el paciente ${ info.data.patient }`,
      `Hola ${ info.data.doctorName }`,
      `Has creado una nueva cita con el paciente <b>${ info.data.patient }</b> para el día <b>${ info.data.date }</b> de <b>${ info.data.timeStart }</b> a <b>${ info.data.timeEnd }</b> con motivo de <b>${ info.data.motive }</b>.`,
    );
  }

  /**
   * Envío de la actualización de la cita en el calendario
   * @to Paciente
   * @module Calendario
   * @param info Información necesaria para el correo electrónico
   */
  public sendScheduleUpdateToPatient(info: IMailStructure) {
    // Loading vars
    const env: IEnvironment = checkEnvironment();

    // Build message
    this.emailService.mailOptions(
      (process.env.EMAIL_PATIENT || env.EMAIL_PATIENT || info.to),
      'Cita actualizada',
      `Hola ${ info.data.patientName }`,
      `
        Se actualizó tu cita con el Dr. Froilán para el día <b>${ info.data.date }</b> de <b>${ info.data.timeStart }</b> a <b>${ info.data.timeEnd }</b> con motivo de <b>${ info.data.motive }</b>.
        <br/><br/>
        Recuerda llegar a las <b>8:00 am</b> al consultorio y pronto será contáctado por el equipo del Dr. Froilán Páez para coordinar los detalles.
      `,
    );
  }

  /**
   * Envío de la actualización de la cita en el calendario
   * @to Doctor
   * @module Calendario
   * @param info Información necesaria para el correo electrónico
   */
  public sendScheduleUpdateToDoctor(info: IMailStructure) {
    this.emailService.mailOptions(
      info.to,
      `Cita actualizada con el paciente ${ info.data.patient }`,
      `Hola ${ info.data.doctorName }`,
      `Has actualizado la cita con el paciente <b>${ info.data.patient }</b> para el día <b>${ info.data.date }</b> de <b>${ info.data.timeStart }</b> a <b>${ info.data.timeEnd }</b> con motivo de <b>${ info.data.motive }</b>.`,
    );
  }

  /**
   * Envío de la eliminación de la cita en el calendario
   * @to Paciente
   * @module Calendario
   * @param info Información necesaria para el correo electrónico
   */
  public sendScheduleDeleteToPatient(info: IMailStructure) {
    // Loading vars
    const env: IEnvironment = checkEnvironment();

    // Build message
    this.emailService.mailOptions(
      (process.env.EMAIL_PATIENT || env.EMAIL_PATIENT || info.to),
      'Cita eliminada',
      `Hola ${ info.data.patientName }`,
      `
        Tu cita con el Dr. Froilán para el día <b>${ info.data.date }</b> de <b>${ info.data.timeStart }</b> a <b>${ info.data.timeEnd }</b> con motivo de <b>${ info.data.motive }</b> fue eliminada. Para agendar una nueva cita utiliza la siguiente opción:
        <br/><br/>

        <span class="es-button-border centrar" style="border-style:solid;border-color:#26A4D3;background:#795B16;border-width:0px;border-radius:50px;width:auto;"><a href="${ env.CLIENT_SERVER }/online/appointment" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;transition:all 100ms ease-in;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size:14px;color:#FFFFFF;border-style:solid;border-color:#795B16;border-width:15px 30px 15px 30px;display:inline-block;background:#795B16;border-radius:50px;font-weight:bold;font-style:normal;line-height:17px;width:auto;text-align:center;">
        AGENDA NUEVA CITA
        </a></span>

        <style>
          .centrar {
            text-align: center;
            display: block;
            text-transform: uppercase;
          }
        </style>
      `,
    );
  }

  /**
   * Envío de la eliminación de la cita en el calendario
   * @to Doctor
   * @module Calendario
   * @param info Información necesaria para el correo electrónico
   */
  public sendScheduleDeleteToDoctor(info: IMailStructure) {
    this.emailService.mailOptions(
      info.to,
      `Cita eliminada con el paciente ${ info.data.patient }`,
      `Hola ${ info.data.doctorName }`,
      `Has eliminado la cita con el paciente <b>${ info.data.patient }</b> para el día <b>${ info.data.date }</b> de <b>${ info.data.timeStart }</b> a <b>${ info.data.timeEnd }</b> con motivo de <b>${ info.data.motive }</b>.`,
    );
  }

  /**
   * Envío de la eliminación de las citas en un rango de fechas
   * @to Doctor
   * @module Calendario
   * @param info Información necesaria para el correo electrónico
   */
  public sendScheduleDeleteFromDateToDoctor(info: IMailStructure) {
    this.emailService.mailOptions(
      info.to,
      `Citas canceladas`,
      `Hola ${ info.data.doctorName }`,
      `Fueron canceladas las citas establecidas desde <b>${ info.data.dateStart }</b> hasta <b>${ info.data.dateEnd }</b> y los pacientes ya fueron notificados vía correo electrónico.`,
    );
  }
}
