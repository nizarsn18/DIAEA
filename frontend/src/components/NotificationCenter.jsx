import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Info, AlertTriangle, CheckCircle, Package } from 'lucide-react';
import { getNotifications, marquerNotificationLue, toutMarquerNotificationLu } from '../api';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifs = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Erreur chargement notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 15000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.lue).length;

  const handleMarkAsRead = async (id) => {
    try {
      await marquerNotificationLue(id);
      fetchNotifs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await toutMarquerNotificationLu();
      fetchNotifs();
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'DEMANDE': return <Package size={16} color="#00b4d8" />;
      case 'INCIDENT': return <AlertTriangle size={16} color="#ffbe0b" />;
      case 'ATTRIBUTION': return <CheckCircle size={16} color="#06d6a0" />;
      default: return <Info size={16} color="#8338ec" />;
    }
  };

  return (
    <div className="notif-container">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="notif-btn"
        title="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="notif-badge">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notif-banner">
          <div className="notif-banner-header">
            <div className="notif-banner-title">
              <Bell size={16} color="#00b4d8" />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="notif-banner-count">
                  {unreadCount} nouvelles
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} className="notif-banner-readall">
                <CheckCheck size={14} /> Tout lire
              </button>
            )}
          </div>

          <div className="notif-banner-list">
            {notifications.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Aucune notification pour le moment.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.lue && handleMarkAsRead(n.id)}
                  className={`notif-banner-item ${!n.lue ? 'unread' : ''}`}
                >
                  <div className="notif-banner-icon">
                    {getIcon(n.type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="notif-banner-text">{n.message}</div>
                    <span className="notif-banner-time">
                      {new Date(n.dateEnvoi).toLocaleString('fr-FR')}
                    </span>
                  </div>
                  {!n.lue && (
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', marginTop: '4px', flexShrink: 0 }} />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
