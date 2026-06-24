
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";
import "./ProfileDropdown.css";

const ProfileDropdown = ({ user, onClose }) => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    nombre: user?.nombre || "",
    email: user?.email || "",
    telefono: user?.telefono || "",
    ciudad: user?.ciudad || "",
  });

  useEffect(() => {
    // Reset form when user changes
    setFormData({
      nombre: user?.nombre || "",
      email: user?.email || "",
      telefono: user?.telefono || "",
      ciudad: user?.ciudad || "",
    });
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await api.patch("/perfil/", {
        nombre: formData.nombre,
        telefono: formData.telefono,
        ciudad: formData.ciudad,
      });
      // Update user in localStorage if needed
      const storedUser = JSON.parse(localStorage.getItem("user"));
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          user: { ...storedUser.user, ...response.data },
        })
      );
      setSuccess("Perfil actualizado correctamente");
      setTimeout(() => {
        setEditing(false);
        setSuccess("");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.error || "Error al actualizar el perfil"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    onClose();
    navigate("/");
  };

  return (
    <div className={`profile-card ${isDarkMode ? "dark" : ""}`}>
      <div className="profile-header">
        <div className="profile-avatar">
          {formData.nombre.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2>{formData.nombre}</h2>
          <p>{formData.email}</p>
        </div>
      </div>

      {error && (
        <div className="profile-alert error">{error}</div>
      )}
      {success && (
        <div className="profile-alert success">{success}</div>
      )}

      <div className="profile-content">
        <div className="profile-info">
          <label>Nombre</label>
          {editing ? (
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              disabled={loading}
            />
          ) : (
            <span>{formData.nombre}</span>
          )}
        </div>

        <div className="profile-info">
          <label>Correo</label>
          <span>{formData.email}</span>
        </div>

        <div className="profile-info">
          <label>Teléfono</label>
          {editing ? (
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              disabled={loading}
            />
          ) : (
            <span>{formData.telefono || "No agregado"}</span>
          )}
        </div>

        <div className="profile-info">
          <label>Ciudad</label>
          {editing ? (
            <input
              type="text"
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              disabled={loading}
            />
          ) : (
            <span>{formData.ciudad || "No agregada"}</span>
          )}
        </div>
      </div>

      <div className="profile-actions">
        {editing ? (
          <>
            <button
              className="save-btn"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
            <button
              className="cancel-btn"
              onClick={() => {
                setEditing(false);
                setError("");
                setSuccess("");
                setFormData({
                  nombre: user?.nombre || "",
                  email: user?.email || "",
                  telefono: user?.telefono || "",
                  ciudad: user?.ciudad || "",
                });
              }}
              disabled={loading}
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <button className="edit-btn" onClick={() => setEditing(true)}>
              Editar Perfil
            </button>
            <button className="go-to-profile-btn" onClick={() => {
              onClose();
              navigate("/profile");
            }}>
              Ver Perfil Completo
            </button>
          </>
        )}

        {!editing && (
          <button className="logout-btn" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileDropdown;
