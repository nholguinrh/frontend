package mx.com.totalplay.smc.commons.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIdentityReference;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@JsonIdentityReference
@AllArgsConstructor
@NoArgsConstructor
public class GrupoTickets {

	private int id;
	private String name;
	private int value;
	private String ico;
	private String color;
	private boolean selected;
	private List<DataDto> data;
	
}
