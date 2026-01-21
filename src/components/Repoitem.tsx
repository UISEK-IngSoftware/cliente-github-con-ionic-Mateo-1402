import React, { useState } from 'react';
import {
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonIcon,
  IonAlert,
} from '@ionic/react';
import { createOutline, trashOutline } from 'ionicons/icons';
import './Repoitem.css';
import { RepositoryItem } from '../interfaces/RepositoryItem';
import { deleteRepository, editRepository } from '../services/GithubServices';

const RepoItem: React.FC<{ repo: RepositoryItem; onRefresh?: () => void }> = ({ repo, onRefresh }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [name, setName] = useState(repo.name);
  const [description, setDescription] = useState(repo.description || '');

  const handleEdit = () => {
    setShowAlert(true);
  };

  const handleConfirmEdit = async () => {
    if (repo.owner && name.trim()) {
      try {
        console.log('Intentando editar:', repo.owner, repo.name, { name, description });
        const result = await editRepository(repo.owner, repo.name, {
          name: name,
          description: description,
        });
        console.log('Editado exitosamente:', result);
        setShowAlert(false);
        setTimeout(() => {
          onRefresh?.();
        }, 500);
      } catch (error) {
        console.error('Error:', error);
        alert('Error al editar');
      }
    } else {
      alert('El nombre no puede estar vacío');
    }
  };

  const handleDelete = async () => {
    if (repo.owner) {
      try {
        await deleteRepository(repo.owner, repo.name);
        onRefresh?.();
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  };

  return (
    <IonItemSliding>
      <IonItem>
        <IonThumbnail slot="start">
          <img src={repo.imageUrl || 'https://ionicframework.com/docs/demos/api/list/avatar-finn.png'} alt={repo.name} />
        </IonThumbnail>
        <IonLabel>
          <h2>{name}</h2>
          <p>{description}</p>
          <p>Propietario: {repo.owner}</p>
        </IonLabel>
      </IonItem>

      <IonItemOptions side="end">
        <IonItemOption color="primary" onClick={handleEdit}>
          <IonIcon slot="icon-only" icon={createOutline} />
        </IonItemOption>
        <IonItemOption color="danger" onClick={handleDelete}>
          <IonIcon slot="icon-only" icon={trashOutline} />
        </IonItemOption>
      </IonItemOptions>

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => {
          setShowAlert(false);
          setName(repo.name);
          setDescription(repo.description || '');
        }}
        header="Editar Repositorio"
        inputs={[
          {
            name: 'name',
            type: 'text',
            placeholder: 'Nombre',
            value: name,
          },
          {
            name: 'description',
            type: 'text',
            placeholder: 'Descripción',
            value: description,
          },
        ]}
        buttons={[
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Guardar',
            handler: (data: any) => {
              // data contiene los inputs: data.name y data.description
              const newName = (data && data.name) || '';
              const newDescription = (data && data.description) || '';
              // Llamada directa aquí para usar los valores editados por el alert
              (async () => {
                if (!repo.owner) {
                  alert('Propietario no encontrado');
                  return;
                }
                if (!newName.trim()) {
                  alert('El nombre no puede estar vacío');
                  return;
                }
                try {
                  console.log('Editando desde alert:', repo.owner, repo.name, { newName, newDescription });
                  await editRepository(repo.owner, repo.name, { name: newName, description: newDescription });
                  setName(newName);
                  setDescription(newDescription);
                  setShowAlert(false);
                  setTimeout(() => onRefresh?.(), 500);
                } catch (err) {
                  console.error('Error editando desde alert:', err);
                  alert('Error al editar el repositorio');
                }
              })();
            },
          },
        ]}
      />
    </IonItemSliding>
  );
};

export default RepoItem;