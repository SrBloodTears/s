import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Personagem } from './persona.model';
import { Usuario } from '../home/usuario.model';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { IonicModule, LoadingController, NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.page.html',
  styleUrls: ['./persona.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HttpClientModule],
  providers: [HttpClient, Storage]
})
export class PersonaPage implements OnInit {

  public usuario: Usuario = new Usuario();
  public lista_personagens: Personagem[] = [];
  private _storage: Storage | null = null;

  constructor(
    public http: HttpClient,
    public storage: Storage,
    public controle_toast: ToastController,
    public controle_navegacao: NavController,
    public controle_carregamento: LoadingController,
  ) { }


  async ngOnInit() {

    this._storage = await this.storage.create();

    await this.storage.create();

    const registro = await this._storage.get('usuario');

    if (registro) {
      console.log('Usuário encontrado:', registro);
    } else {
      console.log('Nenhum usuário encontrado');
    }
  }

  async consultarPersonagensSistemaWeb() {
    const loading = await this.controle_carregamento.create({
      message: 'Pesquisando...',
      duration: 60000
    });
    await loading.present();

    const http_headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${this.usuario.token}`
    });

    this.http.get(
      'http://127.0.0.1:8000/persona/api/',
      { headers: http_headers }
    ).subscribe({
      next: async (resposta: any) => {
        this.lista_personagens = resposta;
        await loading.dismiss();
      },
      error: async (erro: any) => {
        await loading.dismiss();
        const mensagem = await this.controle_toast.create({
          message: `Falha ao consultar personagens: ${erro.message}`,
          cssClass: 'ion-text-center',
          duration: 2000
        });
        mensagem.present();
      }
    });
  }

  async excluirPersonagem(id: number) {
    const loading = await this.controle_carregamento.create({ message: 'Autenticando...', duration: 30000 });
    await loading.present();

    const http_headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${this.usuario.token}`
    });

    this.http.delete(
      `http://127.0.0.1:8000/persona/api/${id}/`,
      {
        headers: http_headers
      }
    ).subscribe({
      next: async () => {
        this.consultarPersonagensSistemaWeb();
        const mensagem = await this.controle_toast.create({
            message: 'Personagem excluído com sucesso.',
            cssClass: 'ion-text-center',
            duration: 2000
          });
          mensagem.present();
        loading.dismiss();
      },
      error: async (erro: any) => {
        loading.dismiss();
        const mensagem = await this.controle_toast.create({
          message: `Falha ao excluir o personagem: ${erro.message}`,
          cssClass: 'ion-text-center',
          duration: 2000
        });
        mensagem.present();
      }
    });
  }
}
