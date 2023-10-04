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
@Table(name = "DashboardCuadrantes")
public class TbDashboardCuadrante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idDashboardCuadrantes")
    private Long idDashboardCuadrante;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idDashboard", nullable = false, foreignKey = @ForeignKey(name = "FK_TbDashboardCuadrante_TbDashboard"))
    private TbDashboard tbDashboard;

    @Column(name = "titulo", length = 80)
    private String titulo;

    @Column(name = "nombre", length = 80)
    private String nombre;

    @Column(name = "activarEdicion")
    private Integer activarEdicion;

    @JsonIgnore
    @Column(name = "fechaCreacion")
    private LocalDateTime fechaCreacion;

}
