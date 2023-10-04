package mx.com.totalplay.smc.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "PaqueteMetricas")
public class TbPaqueteMetrica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idPaqueteMetricas")
    private Long idPaqueteMetrica;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idCatPaquetes", nullable = false, foreignKey = @ForeignKey(name = "FK_TbPaqueteMetrica_TbCatPaquete"))
    private TbCatPaquete tbCatPaquete;

    @ManyToOne
    @JoinColumn(name = "idMetricas", nullable = false, foreignKey = @ForeignKey(name = "FK_TbPaqueteMetrica_TbMetrica"))
    private TbMetrica tbMetrica;

    @JsonIgnore
    @Column(name = "fechaCreacion")
    private LocalDateTime fechaCreacion;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creadoPor", nullable = false, foreignKey = @ForeignKey(name = "FK_TbPaqueteMetrica_TbUsuario_CreadoPor"))
    private TbUsuario creadoPor;
    
    @JsonIgnore
    @Column(name = "fechaActualizacion")
    private LocalDateTime fechaActualizacion;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actualizadoPor", foreignKey = @ForeignKey(name = "FK_TbPaqueteMetrica_TbUsuario_ActualizadoPor"))
    private TbUsuario actualizadoPor;
    
    @JsonIgnore
    @Column(name = "fechaBaja")
    private LocalDateTime fechaBaja;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "eliminadoPor", foreignKey = @ForeignKey(name = "FK_TbPaqueteMetrica_TbUsuario_EliminadoPorr"))
    private TbUsuario eliminadoPor;

    @Column(name = "activoInactivo", length = 1)
    private String activoInactivo;

}
