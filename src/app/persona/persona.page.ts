import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { IonicModule, LoadingController, NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Personagem } from './persona.model';
import { Usuario } from '../home/usuario.model';

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
    public controle_carregamento: LoadingController
  ) { }

  async ngOnInit() {
    // Inicializa o storage
    await this.storage.create();

    // Recupera o usuário armazenado
    const registro = await this.storage.get('usuario');

    if (registro) {
      this.usuario = Object.assign(new Usuario(), registro);
      console.log('Usuário encontrado:', this.usuario);

      // Chama o método para buscar os personagens
      this.consultarPersonagensSistemaWeb();
    } else {
      console.log('Nenhum usuário encontrado');
      this.controle_navegacao.navigateRoot('/home');
    }
  }

  // Função para buscar os personagens do sistema web
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
  
    this.http.get('http://127.0.0.1:8000/persona/api/', { headers: http_headers })
      .subscribe({
        next: async (resposta: any) => {
          // Adicionando um console.log para exibir a resposta da API
          console.log('Dados recebidos da API:', resposta);
  
          // Agora, fazemos o filtro para pegar apenas os personagens que pertencem ao usuário atual
          this.lista_personagens = resposta.filter((personagem: any) => personagem.usuario === this.usuario.id);
  
          // Exibe no console os personagens filtrados
          console.log('Personagens filtrados:', this.lista_personagens);
  
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
    const loading = await this.controle_carregamento.create({
      message: 'Excluindo personagem...',
      duration: 30000
    });
    await loading.present();
  
    const http_headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${this.usuario.token}`
    });
  
    this.http.delete(`http://127.0.0.1:8000/persona/api/${id}/`, { headers: http_headers })
      .subscribe({
        next: async () => {
          await loading.dismiss();
          const mensagem = await this.controle_toast.create({
            message: 'Personagem excluído com sucesso.',
            cssClass: 'ion-text-center',
            duration: 2000
          });
          mensagem.present();
          this.consultarPersonagensSistemaWeb();  // Atualiza a lista de personagens após a exclusão
        },
        error: async (erro: any) => {
          await loading.dismiss();
          const mensagem = await this.controle_toast.create({
            message: `Falha ao excluir o personagem: ${erro.message}`,
            cssClass: 'ion-text-center',
            duration: 2000
          });
          mensagem.present();
        }
      });
  }
  

  // Função para favoritar/desfavoritar um personagem
  async marcarFavorito(id: number) {
    const personagem = this.lista_personagens.find(p => p.id === id);

    if (personagem) {
      personagem.favorito = !personagem.favorito;

      const loading = await this.controle_carregamento.create({
        message: 'Atualizando favorito...',
        duration: 30000
      });
      await loading.present();

      const http_headers: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Token ${this.usuario.token}`
      });

      this.http.put(`http://127.0.0.1:8000/persona/api/${id}/`, personagem, { headers: http_headers })
        .subscribe({
          next: async () => {
            await loading.dismiss();
            const mensagem = await this.controle_toast.create({
              message: `Personagem ${personagem.favorito ? 'favoritado' : 'desfavoritado'} com sucesso!`,
              duration: 2000
            });
            mensagem.present();
          },
          error: async (erro: any) => {
            await loading.dismiss();
            const mensagem = await this.controle_toast.create({
              message: `Erro ao atualizar o status de favorito: ${erro.message}`,
              duration: 2000
            });
            mensagem.present();
          }
        });
    } else {
      console.error('Personagem não encontrado.');
    }
  }
}
