import React, { useState } from 'react';
import {
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonAlert,
  IonIcon,
} from '@ionic/react';
import { createOutline, trashOutline } from 'ionicons/icons';
import './Repoitem.css';
import { RepositoryItem } from '../interfaces/RepositoryItem';
import { deleteRepository, editRepository } from '../services/GithubServices';

// Item deslizable: revela Editar/Eliminar
const RepoItem: React.FC<{ repo: RepositoryItem; onRefresh?: () => void }> = ({ repo, onRefresh }) => {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showEditAlert, setShowEditAlert] = useState(false);

  // Elimina y refresca
  const handleDelete = async () => {
    setShowDeleteAlert(false);
    const success = await deleteRepository(repo.owner, repo.name);
    if (success && onRefresh) onRefresh();
  };

  // Edita con datos del alert
  const handleEdit = async (data: any) => {
    setShowEditAlert(false);
    const payload: { name?: string; description?: string } = {};
    if (data.name && data.name !== repo.name) payload.name = data.name;
    payload.description = data.description;
    const res = await editRepository(repo.owner, repo.name, payload);
    if (res && onRefresh) onRefresh();
  };

  return (
    <>
      {/* Item deslizable */}
      <IonItemSliding>
        <IonItem>
          <IonThumbnail slot="start">
            <img src={repo.imageUrl || 'https://ionicframework.com/docs/demos/api/list/avatar-finn.png'} alt={repo.name} />
          </IonThumbnail>
          <IonLabel>
            <h2>{repo.name}</h2>
            <p>{repo.description}</p>
            <p>Propietario: {repo.owner}</p>
          </IonLabel>
        </IonItem>

        {/* Opciones */}
        <IonItemOptions side="end">
          <IonItemOption color="primary" onClick={() => setShowEditAlert(true)} title="Editar">
            <IonIcon slot="icon-only" icon={createOutline} />
          </IonItemOption>
          <IonItemOption color="danger" onClick={() => setShowDeleteAlert(true)} title="Eliminar">
            <IonIcon slot="icon-only" icon={trashOutline} />
          </IonItemOption>
        </IonItemOptions>
      </IonItemSliding>

      {/* Confirmar eliminación */}
      <IonAlert
        isOpen={showDeleteAlert}
        onDidDismiss={() => setShowDeleteAlert(false)}
        header={'Confirmar eliminación'}
        message={`¿Eliminar el repositorio "${repo.name}"? Esta acción no se puede deshacer.`}
        buttons={[{ text: 'Cancelar', role: 'cancel' }, { text: 'Eliminar', handler: () => handleDelete() }]}
      />

      {/* Editar nombre y descripción */}
      <IonAlert
        isOpen={showEditAlert}
        onDidDismiss={() => setShowEditAlert(false)}
        header={'Editar repositorio'}
        inputs={[
          { name: 'name', type: 'text', value: repo.name, placeholder: 'Nombre' },
          { name: 'description', type: 'text', value: repo.description ?? '', placeholder: 'Descripción' },
        ]}
        buttons={[{ text: 'Cancelar', role: 'cancel' }, { text: 'Guardar', handler: (data) => handleEdit(data) }]}
      />
    </>
  );
};

export default RepoItem;