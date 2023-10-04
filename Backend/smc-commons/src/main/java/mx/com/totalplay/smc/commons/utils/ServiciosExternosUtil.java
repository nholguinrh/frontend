package mx.com.totalplay.smc.commons.utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.com.totalplay.smc.commons.model.ConsultarAlarmasResponseDto;
import mx.com.totalplay.smc.commons.model.ConsultarMetricasResponseDto.Data;
import mx.com.totalplay.smc.commons.model.ConsultarMetricasResponseDto.Metrica;
import mx.com.totalplay.smc.commons.model.DataDto;
import mx.com.totalplay.smc.commons.model.EstadisticasMetricasDto;
import mx.com.totalplay.smc.commons.model.GrupoTickets;
import mx.com.totalplay.smc.entities.TbClientePunta;
import mx.com.totalplay.smc.entities.TbConfiguracionSLAMetrica;
import mx.com.totalplay.smc.repositories.IClientePuntaRepository;
import mx.com.totalplay.smc.repositories.IConfiguracionSLAMetricaRepository;

public class ServiciosExternosUtil {
	
//	SimpleDateFormat formato = new SimpleDateFormat("yyyy-MM-dd kk:mm:ss");
	public static DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
	
	public static String agregarUnMes(String date) {
		return date.substring(0, 5) + formatString(2, Integer.toString(Integer.parseInt(date.substring(5, 7)) + 1), true) + date.substring(7);
	}
	
	public static String formatString( int longitud, String format, boolean left ){
		for( int i = ( longitud - format.length() ) ; i > 0; i-- ){
			if( left )
				format = "0" + format;
			else
				format = format + "0";
		}
		return format;
	}
	
	public static int alarmaValorMaximo(ConsultarAlarmasResponseDto dto) {
		int maximo = 0;
		if(dto.getDispositicosConIncMem()>maximo) maximo = dto.getDispositicosConIncMem();
		if(dto.getDispositivosConIncCPU()>maximo) maximo = dto.getDispositivosConIncCPU();
		if(dto.getDispositivosInalcanzables()>maximo) maximo = dto.getDispositivosInalcanzables();
		if(dto.getDispositivosSinGestion()>maximo) maximo = dto.getDispositivosSinGestion();
		return maximo;
	}
	
	public static int getMetricaValue(List<Metrica> metricas, String metrica) {
		int value = 0;
		for(Metrica m : metricas) {
			if(m.getNombre().toLowerCase().contains(metrica)) {
				value = m.getPorcentajePromedio();
				break;
			}
		}
		return value;
	}
	
	public static int recuperarTiempoEnMinutos(String tiempoCaida) {
		int minutos = 0;
		String _value = "";
		for(int i = 0; i < tiempoCaida.trim().length(); i++) {
			try {
				_value = _value + new Integer(tiempoCaida.trim().substring(i, (i+1))).toString();
			} catch (Exception e) {
				break;
			}
		}
		String ut = "m";
		if(tiempoCaida.trim().contains("h")) ut = "h";
		else if(tiempoCaida.trim().contains("d")) ut = "d";
		if(ut.equals("m")) 
			minutos = Integer.parseInt(_value);
		else if(ut.equals("h"))
			minutos = Integer.parseInt(_value) * 60;
		else if(ut.equals("d"))
			minutos = (Integer.parseInt(_value) * 24) * 60;
		return minutos;
	}
	
	@Getter
	@Setter
	@NoArgsConstructor
	public static class ProcesarTicketsResponse{
		private TreeMap<String, GrupoTickets> mapa;
		private int tiempoMinimoRespuesta;
		private int tiempoMaximoRespuesta;
		private int tiempoPromedioRespuesta;
		private int totalTickets;
		private int totalTicketsResueltos;
	}
	
//	@SuppressWarnings("serial")
	
//	public static Map<String, mx.com.totalplay.smc.commons.model.ConsultarVistaGeneralResponseDto.Dispositivo> procesarVistaGeneral(List<mx.com.totalplay.smc.commons.model.ConsultarVistaGeneralResponseDto.Dispositivo> dispositivos) {
//		Map<String, mx.com.totalplay.smc.commons.model.ConsultarVistaGeneralResponseDto.Dispositivo> mapa = new HashMap<>();
//		for(mx.com.totalplay.smc.commons.model.ConsultarVistaGeneralResponseDto.Dispositivo d : dispositivos) {
//			mx.com.totalplay.smc.commons.model.ConsultarVistaGeneralResponseDto.Dispositivo tipoDis = mapa.get(d.getTipoDispositivo().toLowerCase());
//			if(tipoDis==null) {
//				Map<String, Integer> map = new TreeMap<>();
//				for(mx.com.totalplay.smc.commons.model.ConsultarVistaGeneralResponseDto.Data data : d.getData()) {
//					Integer value = map.get(data.getFecha().substring(0, 10)+data.getEstatus().toLowerCase());
//					if(value==null)
//						map.put(data.getFecha().substring(0, 10)+data.getEstatus().toLowerCase(), Integer.parseInt(data.getValor()));
//					else {
//						value = value + Integer.parseInt(data.getValor());
//						map.put(data.getFecha().substring(0, 10)+data.getEstatus().toLowerCase(), value);
//					}
//				}
//				d.setMap(map);
//				mapa.put(d.getTipoDispositivo().toLowerCase(), d);
//			}else {
//				for(mx.com.totalplay.smc.commons.model.ConsultarVistaGeneralResponseDto.Data newData :  d.getData()) {
//					Integer value = tipoDis.getMap().get(newData.getFecha().substring(0, 10)+newData.getEstatus().toLowerCase());
//					if(value==null)
//						tipoDis.getMap().put(newData.getFecha().substring(0, 10)+newData.getEstatus().toLowerCase(), value);
//					else {
//						value = value + Integer.parseInt(newData.getValor());
//						tipoDis.getMap().put(newData.getFecha().substring(0, 10)+newData.getEstatus().toLowerCase(), value);
//					}
//				}
//			}
//		}
//		return mapa;
//	}
	
	@Getter
	@Setter
	@NoArgsConstructor
	public static class ProcesarMetricasResponse{
		private Map<String, Map<String, Data>> mapaMetrica;
		private Map<String, List<Data>> mapaMetricaNoAgrupada;
		private Map<String, Promedio> mapaPromedios;
	}
	
	@Getter
	@Setter
	@Builder
	public static class Promedio{
		private Integer porcentaje;
		private Integer cantidad;
		private Integer debajoDeSla;
		private Integer superiorDeSla;
		private Integer promedioMinimo;
		private Integer promedioMaximo;
	}
	
	@SuppressWarnings("serial")
	public static ProcesarMetricasResponse procesarMetricas(mx.com.totalplay.smc.commons.model.ConsultarMetricasResponseDto.Dispositivo d, 
			int last, Map<String, String> mapaSla) {
		ProcesarMetricasResponse response = new ProcesarMetricasResponse();
		Map<String, Map<String, Data>> mapaMetrica = new TreeMap<>();
		Map<String, List<Data>> mapaMetricaNoAgrupada = new TreeMap<>();
		Map<String, Promedio> mapaPromedios = new TreeMap<>();
		//Agrupamos la data por metrica y por fecha
		for(Data data : d.getData()) {
			Map<String, Data> mapaAgrupada = mapaMetrica.get(data.getMetrica().toLowerCase());
			if(mapaAgrupada == null) {
//				data.setCantidad(1);
				final int _last = last;
				mapaMetrica.put(data.getMetrica().toLowerCase(), new TreeMap<String, Data>() {{ put( _last == 0 ? data.getFecha() : data.getFecha().substring(0, _last), data); }});
			}else {
				Data dataOld = mapaAgrupada.get(last == 0 ? data.getFecha() : data.getFecha().substring(0, last));
				if(dataOld==null) {
//					data.setCantidad(1);
					mapaAgrupada.put(last == 0 ? data.getFecha() : data.getFecha().substring(0, last), data);
				}else {
//					dataOld.setCantidad(dataOld.getCantidad()+1);
					double prc = Double.parseDouble(dataOld.getPorcentaje());
					prc += Double.parseDouble(data.getPorcentaje());
//					prc = prc / dataOld.getCantidad();
					dataOld.setPorcentaje(Double.toString(prc));
					double prcOld = Double.parseDouble(dataOld.getPorcentajeDiaAnterior());
					prcOld += Double.parseDouble(data.getPorcentajeDiaAnterior());
//					prcOld = prcOld / dataOld.getCantidad();
					dataOld.setPorcentajeDiaAnterior(Double.toString(prcOld));
				}			
			}
			//Estadisticas/Promedio general por metrica
			//Cantidad de data debajo de SLA
			//Promedio minimo y maximo
			Promedio promedio = mapaPromedios.get(data.getMetrica().toLowerCase());
			String sla = mapaSla.get(data.getMetrica().toLowerCase());
			int slaInt = 0;
			if(sla!=null) slaInt = Integer.parseInt(sla);
			boolean debajo = false;
			if(slaInt > new Integer(data.getPorcentaje())) debajo = true;
			if(promedio == null)
				mapaPromedios.put(data.getMetrica().toLowerCase(), Promedio.builder()
						.porcentaje(new Integer(data.getPorcentaje()))
						.cantidad(1)
						.debajoDeSla(debajo ? 1 : 0)
						.superiorDeSla(debajo ? 0 : 1)
						.promedioMinimo(new Integer(data.getPorcentaje()))
						.promedioMaximo(new Integer(data.getPorcentaje()))
						.build() );
			else {
				promedio.setCantidad(promedio.getCantidad()+1);
				promedio.setPorcentaje(promedio.getPorcentaje() + new Integer(data.getPorcentaje()));
				promedio.setDebajoDeSla(debajo ? promedio.getDebajoDeSla() + 1 : promedio.getDebajoDeSla());
				promedio.setSuperiorDeSla(debajo ? promedio.getSuperiorDeSla() : promedio.getSuperiorDeSla() + 1 );
				if(Integer.parseInt(data.getPorcentaje()) < promedio.getPromedioMinimo()) 
					promedio.setPromedioMinimo(new Integer(data.getPorcentaje()));
				else if(Integer.parseInt(data.getPorcentaje()) > promedio.getPromedioMaximo()) 
					promedio.setPromedioMaximo(new Integer(data.getPorcentaje()));
			}
			//Data agrupada solo por metrica
			List<Data> mapaAgrupada2 = mapaMetricaNoAgrupada.get(data.getMetrica().toLowerCase());
			if(mapaAgrupada2 == null) {
				mapaAgrupada2 = new ArrayList<>();
				mapaAgrupada2.add(Data.builder()
						.id(LocalDateTime.parse(data.getFecha().replace('T', ' ').substring(0,19), formatter))
						.fecha(data.getFecha())
						.metrica(data.getMetrica().toLowerCase())
						.porcentaje(data.getPorcentaje())
						.porcentajeDiaAnterior(data.getPorcentajeDiaAnterior())
						.build());
				mapaMetricaNoAgrupada.put(data.getMetrica().toLowerCase(), mapaAgrupada2);
			}else {
				mapaAgrupada2.add(Data.builder()
						.id(LocalDateTime.parse(data.getFecha().replace('T', ' ').substring(0,19), formatter))
						.fecha(data.getFecha())
						.metrica(data.getMetrica().toLowerCase())
						.porcentaje(data.getPorcentaje())
						.porcentajeDiaAnterior(data.getPorcentajeDiaAnterior())
						.build());
			}
		}
		
		//Calculamos el promedio
		for(Map.Entry<String, Promedio> entry : mapaPromedios.entrySet()) {
			Promedio p = entry.getValue();
			p.setPorcentaje((int)(p.getPorcentaje() / p.getCantidad()));
		}
		
		//Calculamos el promedio metricas
//		for(Map.Entry<String, Map<String, Data>> entry : mapaMetrica.entrySet()) {
//			for(Map.Entry<String, Data> data : entry.getValue().entrySet()) {
//				data.getValue().setPorcentaje(Double.toString(Double.parseDouble(data.getValue().getPorcentaje()) / data.getValue().getCantidad()));
//				data.getValue().setPorcentajeDiaAnterior(Double.toString(Double.parseDouble(data.getValue().getPorcentajeDiaAnterior()) / data.getValue().getCantidad()));
//			}
//		}
		
		for(Map.Entry<String, List<Data>> entry : mapaMetricaNoAgrupada.entrySet())
			Collections.sort(entry.getValue(), Comparator.comparing(s -> s.getId()));
		
		response.setMapaMetrica(mapaMetrica);
		response.setMapaMetricaNoAgrupada(mapaMetricaNoAgrupada);
		response.setMapaPromedios(mapaPromedios);
		return response;
	}
	
	public static void sumarizarSla(Map<String, Promedio> des, Map<String, String> src ) {
		for(Map.Entry<String, String> current : src.entrySet()) {
			Promedio promedio = des.get(current.getKey().toLowerCase());
			if(promedio == null)
				des.put(current.getKey().toLowerCase(), Promedio.builder()
						.porcentaje(Integer.parseInt(current.getValue()))
						.cantidad(1)
						.build());
			else {
				promedio.setCantidad(promedio.getCantidad()+1);
				promedio.setPorcentaje(promedio.getPorcentaje()+Integer.parseInt(current.getValue()));
			}
		}
	}
	
	public static void promediarSla(Map<String, Promedio> map) {
		for(Map.Entry<String, Promedio> entry : map.entrySet()) {
			Promedio p = entry.getValue();
			p.setPorcentaje((int)(p.getPorcentaje() / p.getCantidad()));
		}
	}
	
	public static void sumarizarMetricaPromedio(Map<String, Promedio> des, Map<String, Promedio> src ) {
		for(Map.Entry<String, Promedio> entry : src.entrySet()) {
			Promedio promedio = des.get(entry.getKey().toLowerCase());
			if(promedio == null)
				des.put(entry.getKey().toLowerCase(), Promedio.builder()
						.porcentaje(entry.getValue().getPorcentaje())
						.cantidad(1)
						.build());
			else {
				promedio.setCantidad(promedio.getCantidad()+1);
				promedio.setPorcentaje(promedio.getPorcentaje()+entry.getValue().getPorcentaje());
			}
		}
	}
	
	public static List<EstadisticasMetricasDto> estadisticaMetrica(Map<String, Promedio> mapaSla, Map<String, Promedio> src) {
		List<EstadisticasMetricasDto> estadisticasMetricas = new ArrayList<>();
		for(Map.Entry<String, Promedio> entry : src.entrySet()) {
			int prc = (int)(entry.getValue().getPorcentaje() / entry.getValue().getCantidad());
			Promedio p = mapaSla.get(entry.getKey().toLowerCase());
			int sla = 0;
			if(p!=null) sla = p.getPorcentaje();
			int dif = (int)(sla - prc);
			estadisticasMetricas.add(EstadisticasMetricasDto.builder()
					.name(entry.getKey().toLowerCase())
					.value(Integer.toString(prc))
					.change(Integer.toString(dif))
					.estatus(0)
					.build());
		}
		return estadisticasMetricas;
	}
	
	public static Map<String, String> recuperarSla(String idDispositivo, 
			IConfiguracionSLAMetricaRepository iMetricaRepository, 
			IClientePuntaRepository iClientePunta) {
		Map<String, String> mapaSla = new HashMap<String, String>();
		try {
			//Recuperamos el SLA para el dispositivo
			List<TbClientePunta> clientePunta = iClientePunta.findByIdDispositivo(idDispositivo);
			long idConfSla = 0;
			if(!clientePunta.isEmpty()) idConfSla = clientePunta.get(clientePunta.size()-1).getTbConfiguracionSLA().getIdConfiguracionSLA();
			List<TbConfiguracionSLAMetrica> metricas = iMetricaRepository.buscarPorIdConfiguracion(idConfSla);
			for(TbConfiguracionSLAMetrica m : metricas)
				mapaSla.put(m.getTbMetrica().getMetrica().toLowerCase(), m.getValor());
		} catch (Exception e) {}
		return mapaSla;
	}
	
	public static void sumarizarData(Map<String, Map<String, Data>> des, Map<String, Map<String, Data>> src) {
		for(Map.Entry<String, Map<String, Data>> metricas : src.entrySet()) {
			Map<String, Data> data = des.get(metricas.getKey().toLowerCase());
			if(data==null) {
				metricas.getValue().entrySet().forEach(s -> {
//					s.getValue().setCantidad(1);
				});
				des.put(metricas.getKey().toLowerCase(), metricas.getValue());
			}else {
				for(Map.Entry<String, Data> data2 : metricas.getValue().entrySet()) {
					Data dataOld = data.get(data2.getKey().toLowerCase());
					if(dataOld==null) {
//						data2.getValue().setCantidad(1);
						data.put(data2.getKey().toLowerCase(), data2.getValue());
					}else {
//						dataOld.setCantidad(dataOld.getCantidad()+1);
						double prc = Double.parseDouble(dataOld.getPorcentaje());
						prc += Double.parseDouble(data2.getValue().getPorcentaje());
						dataOld.setPorcentaje(Double.toString(prc));
						double prcOld = Double.parseDouble(dataOld.getPorcentajeDiaAnterior());
						prcOld += Double.parseDouble(data2.getValue().getPorcentajeDiaAnterior());
						dataOld.setPorcentajeDiaAnterior(Double.toString(prcOld));
					}
				}
			}
		}
	}
	
	public static List<DataDto> promediarData(Map<String, Data> data){
		List<DataDto> list = new ArrayList<>();
		for(Map.Entry<String, Data> en : data.entrySet())
			list.add(DataDto.builder()
					.date(en.getValue().getFecha())
//					.value((int)(Double.parseDouble(en.getValue().getPorcentaje())/en.getValue().getCantidad()))
					.build());
		return list;
	}
	
	public static void sumarizaDataNoAgrupada(Map<String, List<DataDto>> des, Map<String, List<Data>> src) {
		for(Map.Entry<String, List<Data>> metricas : src.entrySet()) {
			List<DataDto> vm = des.get(metricas.getKey().toLowerCase());
			if(vm == null) {
				vm = new ArrayList<>();
				des.put(metricas.getKey().toLowerCase(), vm);
			}
			for(Data entry : metricas.getValue()) {
				if(entry.getId()==null)
					System.out.println("NULL");
				vm.add(DataDto.builder()
						.id(entry.getId())
						.date(entry.getFecha())
						.value(Double.parseDouble(entry.getPorcentaje()))
						.build());
			}
		}
	}

}
