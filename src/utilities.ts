// axios
import axios from 'axios'

// set apiUrl
const apiUrl =    (process.env.NODE_ENV === 'production')
                                        ? 'https://api.gaf.adro.studio'
                                        : 'http://apiv1.gaf.local'
export default{
    async getFromApi(request:string){
      const response = await axios.get(apiUrl+request)
      .catch(error => {
        return error.response
      })

      return response
    },
    getFormattedTicket(ticketData: any[any]){
      const formattedTicket =  `
                <body style="font-family:sans-serif;display:flex;margin-top:24px; margin-left:24px">
                  <div style="width:188px;flex-shrink:0">
                    <p style="font-size:11px;font-weight:bold;">${ticketData.cine} Sala ${ticketData.sala}</p>
                    <p style="font-size:11px;">${ticketData.fechaVenta} - ${ticketData.horaVenta}</p>
                    <p style="font-size:20px;font-weight:bold;">${ticketData.pelicula}</p>
                    <p style="font-size:18px;font-weight:bold;">Fecha: ${ticketData.fechaFuncion}</p>
                    <p style="font-size:18px;font-weight:bold;">Hora: ${ticketData.horaFuncion}</p>
                    <p style="font-size:11px;">${ticketData.nroEntrada}</p>
                    <p style="font-size:18px;font-weight:bold;">Precio: $${ticketData.precio}</p>
                    <p style="font-size:11px;">Sala: ${ticketData.codigoSala}</p>
                    <p style="font-size:11px;">Función: ${ticketData.funcion}</p>
                    <p style="font-size:11px;">CUIT: ${ticketData.cuit}</p>
                    <p style="font-size:11px;">Talón para el espectador</p>
                  </div>
                  <div style="width:113px;flex-shrink:0">
                    <p style="font-size:11px;">${ticketData.cine} Sala ${ticketData.sala}</p>
                    <p style="font-size:11px;margin-bottom:26px">${ticketData.fechaVenta} - ${ticketData.horaVenta}</p>
                    <p style="font-size:11px;margin-bottom:28px">${ticketData.pelicula}</p>
                    <p style="font-size:11px;margin-bottom:26px">Fecha: ${ticketData.fechaFuncion}</p>
                    <p style="font-size:11px;margin-bottom:26px">Hora: ${ticketData.horaFuncion}</p>
                    <p style="font-size:11px;margin-bottom:26px">${ticketData.nroEntrada}</p>
                    <p style="font-size:11px;margin-bottom:20px">Precio: $${ticketData.precio}</p>
                    <p style="font-size:11px;">Sala: ${ticketData.codigoSala}</p>
                    <p style="font-size:11px;">Función: ${ticketData.funcion}</p>
                    <p style="font-size:11px;">CUIT: ${ticketData.cuit}</p>
                    <p style="font-size:11px;">Talón para urna</p>
                  </div>
                </body>`

          return formattedTicket
    },
    /*getBanners: async function(){  
      const response = await axios.get('https://nuevomonumental.com/mobile/consultas/banners/ObtenerTodos.php').catch(error => {
        console.log(error.response)
        //router.push('/disconnected')
        throw 'Error de Servidor'
      })

      return response.data
    },
    getShowtimes: async function(){  
      const response = await axios.post('https://nuevomonumental.com/mobile/consultas/peliculas/PeliculasConFuncionesYHorarios.php', {withCredentials: false}).catch(error => {
        console.log(error.response)
        //router.push('/disconnected')
        throw 'Error de Servidor'
      })

      console.log(response.data)
    }*/

    async getComingSoon(category:string, request:string){
    
      const response = await axios.get('https://admin.enelcine.com.ar/api/items/'+request).catch(error => {
          console.log(error.response)
          //router.push('/disconnected')
          throw 'Error de Servidor'
      })

      const items = response.data.data

      Promise.resolve(response).then(()=>{
        // news
        if (category == "noticias") {
          items.forEach((item: {[key: string]:any}, index:number) => {
            if (item.portada !== null && item.titulo !== null && item.creado !== null) {
              items[index].creado = this.getElapsedTime(item.creado)
            }
          })
        }

        // movies
        if (category == "peliculas") {
          items.forEach((item: {[key: string]:any}, index:number) => {
            
            items[index].titulo = (item.titulo_local) ? item.titulo_local : item.titulo_original
            
            if (item.fecha_local == this.getThu()) {
              items[index].estreno = true
            }
          })
        }
      })

      return items
    },
    getThu: function() {
      // set dates
      const today = new Date()
      let thisThu = new Date()
      const thuNmb = 4
      let todayNmb = today.getDay()

      // set number for sunday
      if (todayNmb == 0) {
          todayNmb = 7
      }

      // if not default day number
      if (todayNmb != 4) {
          const diff = (todayNmb > thuNmb) ? todayNmb - thuNmb : thuNmb + (todayNmb -1 )
          thisThu.setDate(today.getDate() - diff)
      } else {
          thisThu = today
      }

      thisThu = this.getStringDate(thisThu) as any

      return thisThu
    },
    getStringDate: function(date: Date){
      const dd = String(date.getDate()).padStart(2, '0')
      const mm = String(date.getMonth() + 1).padStart(2, '0')
      const yyyy = date.getFullYear()
      const formattedDate = yyyy + '-' + mm + '-' + dd as any 

      return formattedDate
    },
    getElapsedTime: function(date:string) {
      date = date.replace(' ', 'T') + 'Z'
      const prevTime = new Date(date)
      const thisTime = new Date()
      let timeDiff = thisTime.getTime() - prevTime.getTime()
      timeDiff /= 1000;
      timeDiff = Math.round(timeDiff)

      let time

      if (timeDiff > 31536000) {
          timeDiff = Math.round(timeDiff / 31536000)
          time = (timeDiff <= 1) ? 'año' : 'años'
      } else if (timeDiff > 2629750) {
          timeDiff = Math.round(timeDiff / 2629750)
          time = (timeDiff <= 1) ? 'mes' : 'meses'
      } else if (timeDiff > 604800) {
          timeDiff = Math.round(timeDiff / 604800)
          time = (timeDiff <= 1) ? 'semana' : 'semanas'
      } else if (timeDiff > 86400) {
          timeDiff = Math.round(timeDiff / 86400)
          time = (timeDiff <= 1) ? 'día' : 'días'
      } else if (timeDiff > 3600) {
          timeDiff = Math.round(timeDiff / 3600)
          time = (timeDiff <= 1) ? 'hora' : 'horas'
      } else if (timeDiff > 60) {
          timeDiff = Math.round(timeDiff / 60)
          time = (timeDiff <= 1) ? 'minuto' : 'minutos'
      }

      return 'Hace ' + timeDiff + ' ' + time
    },
    getFormatedDate: function(date:string) {
        let formatedDate
        formatedDate = new Date(date + 'T12:00:00.000Z')
        formatedDate = new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeZone: 'America/Argentina/Buenos_Aires' } as any).format(formatedDate)
        return formatedDate
    }/*,
    setHeader: function(type = '', item: any[string] = []) {
      let image
      let description
      const url = window.location

      const title = item.titulo

      if (type == 'noticias') {
        image = item.portada.data.full_url
        description = item.contenido.substring(0, 120).replace('<p>', '')
      } else if ('peliculas' && item.sinopsis != null) {
        image = item.portada.data.full_url
        description = item.sinopsis.substring(0, 120).replace('<p>', '')
      } else {
        image = window.location.protocol + '//' + window.location.hostname + '/assets/img/main.jpg'
        description = '¡Encontrá toda la información actualizada del cine en Paraguay!'
      }

      const documentElement = document as any

      // Primary Tags
      documentElement.querySelector('head title').textContent = (title) ? title + ' - CinesParaguay' : 'CinesParaguay'
      documentElement.querySelector('[name="description"]').setAttribute('content', description)

      // Facebook
      documentElement.querySelector('[property="og:image"]').setAttribute('content', image)
      documentElement.querySelector('[property="og:title"]').setAttribute('content', title + ' - EnElCine')
      documentElement.querySelector('[property="og:url"]').setAttribute('content', url)
      documentElement.querySelector('[property="og:description"]').setAttribute('content', description)

      // Twitter
      documentElement.querySelector('[property="twitter:image"]').setAttribute('content', image)
      documentElement.querySelector('[property="twitter:title"]').setAttribute('content', title + ' - EnElCine')
      documentElement.querySelector('[property="twitter:url"]').setAttribute('content', url)
      documentElement.querySelector('[property="twitter:description"]').setAttribute('content', description)
    }*/
}