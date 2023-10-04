/**
 * 
 */
package mx.com.totalplay.smc.login.services.impl;

import java.time.LocalDateTime;
import java.time.ZoneId;

import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;
import mx.com.totalplay.smc.commons.exceptions.ApiException;
import mx.com.totalplay.smc.commons.model.EmailModel;
import mx.com.totalplay.smc.commons.model.EmailType;
import mx.com.totalplay.smc.commons.model.ResponseEntityModel;
import mx.com.totalplay.smc.commons.model.UsuarioDto;
import mx.com.totalplay.smc.commons.services.IParametrosService;
import mx.com.totalplay.smc.commons.services.IUsuarioService;
import mx.com.totalplay.smc.commons.services.IUsuarioValidacionService;
import mx.com.totalplay.smc.commons.utils.HttpStatusApi;
import mx.com.totalplay.smc.entities.TbCatEstatus;
import mx.com.totalplay.smc.entities.TbParametros;
import mx.com.totalplay.smc.entities.TbUsuario;
import mx.com.totalplay.smc.entities.TbUsuarioValidacion;
import mx.com.totalplay.smc.login.clients.IEmailFeignClient;
import mx.com.totalplay.smc.login.model.ValidarCodigoModel;
import mx.com.totalplay.smc.login.services.ICodigoVerificacionService;
import mx.com.totalplay.smc.repositories.ICatEstatusRepository;
import mx.com.totalplay.smc.repositories.IUsuarioValidacionRepository;

@Slf4j
@Service
public class CodigoVerificacionServiceImpl implements ICodigoVerificacionService {
	
	private static final String TimeZone = "America/Mexico_City";
	
	@Autowired
	private IUsuarioValidacionRepository usuarioValidacionRepo;
	@Autowired
	private IEmailFeignClient emailClient;
	@Autowired
	private IUsuarioService usuarioSrv;
	@Autowired
	private ICatEstatusRepository estatusRepository;
	@Autowired
	private IUsuarioValidacionService usuarioValidacionSrv;
	@Autowired
	private IParametrosService iParametrosService;
	
	@Override
	public void generayEnviaCodigo(String bearer, Integer idUsuario) throws Exception{
		TbUsuario tbUsuario = usuarioSrv.listarPorId(idUsuario);
		if (tbUsuario == null) {
			throw new ApiException(HttpStatusApi._301, "No existe usuariopára el id:" + idUsuario);
		}
		
		log.debug("Enviando correo a: {}", tbUsuario.getEmail());
		String[] receptor = { tbUsuario.getEmail() };
		String codigo = RandomStringUtils.randomNumeric(6);

		//TODO Agregar un campo que permite guardar si es reennvio o no? x definir.
		TbCatEstatus estatus = estatusRepository.findByDescripcionAndTipoEstatus("Pendiente", "V");
		TbUsuarioValidacion  tbUsuarioValidacion = usuarioValidacionRepo.findByTbUsuarioAndTipoValidacion(tbUsuario,1);
		if (tbUsuarioValidacion == null) {
			usuarioValidacionSrv.registrar(TbUsuarioValidacion.builder()
				.tbUsuario(tbUsuario)
				.tbCatEstatus(estatus)
				.tipoValidacion(1)
				.fechaCreacion(LocalDateTime.now().atZone(ZoneId.of(TimeZone)).toLocalDateTime())
				.token(codigo)
				.build());
		} else {
			tbUsuarioValidacion.setToken(codigo);
			tbUsuarioValidacion.setTbCatEstatus(estatus);
			tbUsuarioValidacion.setFechaCreacion(LocalDateTime.now().atZone(ZoneId.of(TimeZone)).toLocalDateTime());
			usuarioValidacionSrv.modificar(tbUsuarioValidacion);
		}
		TbParametros params = iParametrosService.buscarPorId("3");
		
			emailClient.enviarCorreo(bearer, EmailModel.builder()
					.attachment(null)
					.codigo(codigo)
					.extension(null)
					.nombreCompleto(tbUsuario.getNombreCompleto())
					.receptor(receptor)
					.reenvio(false)
					.idEmpresa(params.getValor())
					.tipo(EmailType.CODIGO).build());

	}
	
	@Override
	public void generayEnviaCodigoRecuperarPwd(String bearer, Integer idUsuario) {
		TbUsuario tbUsuario = usuarioSrv.listarPorId(idUsuario);
		if (tbUsuario == null){
			throw new ApiException(HttpStatusApi._301, "No existe usuariopára el id:" + idUsuario);
		}
		
		log.debug("Enviando correo a: {}", tbUsuario.getEmail());
		String[] receptor = { tbUsuario.getEmail() };
		String codigo = RandomStringUtils.randomNumeric(6);

		//TODO Agregar un campo que permite guardar si es reennvio o no? x definir.
		TbCatEstatus estatus = estatusRepository.findByDescripcionAndTipoEstatus("Pendiente", "V");
		TbUsuarioValidacion  tbUsuarioValidacion = usuarioValidacionRepo.findByTbUsuarioAndTipoValidacion(tbUsuario,2);
		if (tbUsuarioValidacion == null) {
			usuarioValidacionSrv.registrar(TbUsuarioValidacion.builder()
				.tbUsuario(tbUsuario)
				.tbCatEstatus(estatus)
				.tipoValidacion(2)
				.token(codigo)
				.fechaCreacion(LocalDateTime.now().atZone(ZoneId.of(TimeZone)).toLocalDateTime())
				.build());
		} else {
			tbUsuarioValidacion.setToken(codigo);
			tbUsuarioValidacion.setTbCatEstatus(estatus);
			tbUsuarioValidacion.setFechaCreacion(LocalDateTime.now().atZone(ZoneId.of(TimeZone)).toLocalDateTime());
			usuarioValidacionSrv.modificar(tbUsuarioValidacion);
		}
		TbParametros params = iParametrosService.buscarPorId("3");
			emailClient.enviarCorreo(bearer, EmailModel.builder()
				.attachment(null)
				.codigo(codigo)
				.extension(null)
				.nombreCompleto(tbUsuario.getNombreCompleto())
				.receptor(receptor)
				.reenvio(false)
				.idEmpresa(params.getValor())
				.tipo(EmailType.CODIGO_RECUPERAR_PWD).build());
	}

	@Override
	public ResponseEntityModel<UsuarioDto> validarCodigo(ValidarCodigoModel request) {
		TbUsuario tbUsuario = usuarioSrv.listarPorId(request.getIdUsuario());
		TbUsuarioValidacion usrVal = usuarioValidacionRepo.findByTbUsuarioAndTipoValidacion(tbUsuario,1);
		if (usrVal == null)
			throw new ApiException(HttpStatusApi._301,
					"No existe código de verificación pára el id de usuario." + request.getIdUsuario());

		if (usrVal.getTipoValidacion() != 1)
			throw new ApiException(HttpStatusApi._301,
					"El código de verificación no es para Registro.");
		
		TbCatEstatus estatus = estatusRepository.findByDescripcionAndTipoEstatus("Pendiente", "V");
		if(usrVal.getTbCatEstatus().getIdCatEstatus() != estatus.getIdCatEstatus())
			throw new ApiException(HttpStatusApi._301,
					"El código de verificación no tiene un estatus Pendiente.");
				
		if(!usrVal.getToken().equals(request.getCodigo()))
			throw new ApiException(HttpStatusApi._301,
					"El código de verificación es incorrecto.");
		
		LocalDateTime fechaRegistro = usrVal.getFechaCreacion();
		if(fechaRegistro.plusSeconds(120).isBefore(LocalDateTime.now().atZone(ZoneId.of(TimeZone)).toLocalDateTime()))
			throw new ApiException(HttpStatusApi._301,
					"El código de verificación caducó.");

		tbUsuario.setTbCatEstatus(estatusRepository.findByDescripcionAndTipoEstatus("Activo", "U"));
		tbUsuario.setCodigoVerificacion(null);
		usuarioSrv.modificar(tbUsuario);
		
		TbCatEstatus estatusV = estatusRepository.findByDescripcionAndTipoEstatus("Validado", "V");
		usrVal.setTbCatEstatus(estatusV);
		usuarioValidacionSrv.modificar(usrVal);
		
		return new ResponseEntityModel<UsuarioDto>(UsuarioDto.builder().idUsuario(tbUsuario.getIdUsuario()).build(), 
			HttpStatusApi._200,
			"El código de verificación es correcto.");

	}
	
	@Override
	public ResponseEntityModel<String> validarCodigoRecuperarPwd(ValidarCodigoModel request) {
		TbUsuario tbUsuario = usuarioSrv.listarPorId(request.getIdUsuario());
		TbUsuarioValidacion usrVal = usuarioValidacionRepo.findByTbUsuarioAndTipoValidacion(tbUsuario,2);
		if (usrVal == null)
			throw new ApiException(HttpStatusApi._301,
					"No existe código de verificación pára el id de usuario.");

		if (usrVal.getTipoValidacion() != 2)
			throw new ApiException(HttpStatusApi._301,
					"El código de verificación no es para Recuperación de contraseña.");
		
		TbCatEstatus estatus = estatusRepository.findByDescripcionAndTipoEstatus("Pendiente", "V");
		if(usrVal.getTbCatEstatus().getIdCatEstatus() != estatus.getIdCatEstatus())
			throw new ApiException(HttpStatusApi._301,
					"El código de verificación no tiene un estatus Pendiente." + request.getIdUsuario());
		
		if(!usrVal.getToken().equals(request.getCodigo()))
			throw new ApiException(HttpStatusApi._301,
					"El código de verificación es incorrecto.");
			
		LocalDateTime fechaRegistro = usrVal.getFechaCreacion();
		if(fechaRegistro.plusSeconds(120).isBefore(LocalDateTime.now().atZone(ZoneId.of(TimeZone)).toLocalDateTime()))
			throw new ApiException(HttpStatusApi._301,
					"El código de verificación caducó.");
		

		tbUsuario.setTbCatEstatus(estatusRepository.findByDescripcionAndTipoEstatus("Activo", "U"));
		tbUsuario.setCodigoVerificacion(null);
		usuarioSrv.modificar(tbUsuario);
		
		TbCatEstatus estatusV = estatusRepository.findByDescripcionAndTipoEstatus("Validado", "V");
		usrVal.setTbCatEstatus(estatusV);
		usuarioValidacionSrv.modificar(usrVal);
		
		return new ResponseEntityModel<String>(null, HttpStatusApi._200,
			"El código de verificación es correcto.");
	}
	
	

}
