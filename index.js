const Imap = require('imap');

// Параметры подключения к почтовому ящику Gmail, можно было бы хранить в env

const imapConfig = {
    user: 'example@gmail.com',
    password: 'qpudozqxdjslrwvz', // нужно настроить в настройках gmail
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: {
      rejectUnauthorized: false
    }
  };

let unreadCount = 0;
const imap = new Imap(imapConfig);

// Функция обработки новых сообщений
function processNewMessages() {
    return new Promise((resolve,reject)=>{
    imap.openBox('INBOX', true, (err, box) => {
        if (err) {
            console.error('Ошибка при открытии почтового ящика:', err);
            return;
        }

        // Устанавливаем слушателя на событие 'mail' для получения уведомлений о новых сообщениях
        imap.on('mail', (numNewMsgs) => {
            console.log('Получено новых сообщений:', numNewMsgs);
            unreadCount+=numNewMsgs;
            console.log("Kol-vo unseen message uvelicalos do = ",unreadCount);
            resolve(numNewMsgs);
        });

        });
    })
}

function getUnreadMessagesCount(){
    return new Promise((resolve,reject)=>{
        imap.openBox("INBOX",true,(err,box)=>{
            if(err){
                console.log("Errror",err)
                reject(err)
            }
            const unreadQuery = ['UNSEEN'];
            imap.search(unreadQuery,(errCount,resMessages)=>{
                if(errCount){
                    reject(err)
                }
                unreadCount = resMessages.length;
                console.log("Kol-vo unseen message = ",unreadCount);
                resolve(unreadCount);
            })
        })
    })
}



// Функция подключения к почтовому ящику
function connectToMailbox() {
  imap.once('ready',  async() => {
    console.log('Подключение к почтовому ящику установлено');
    let newMessages = await getUnreadMessagesCount(); // Запускаем обработку новых сообщений
    processNewMessages();

  });

  imap.once('error', (err) => {
    console.error('Ошибка при подключении к почтовому ящику:', err);
  });

  imap.once('end', () => {
    console.log('Соединение с почтовым ящиком завершено');
  });

  imap.connect();
}

// Запускаем процесс подключения к почтовому ящику
connectToMailbox();
