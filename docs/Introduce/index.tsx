import React from 'react';
import { Popover, Button } from 'antd';
import styles from './index.less';

const Introduce = () => {
  const img_perfix_path =
    'https://gitee.com/igarashi/huan-plan/raw/master/note/public/img/';

  const igarashi_content = (
    <div className={styles.popover_ctr}>
      <p>
        <img
          src="https://qpluspicture.oss-cn-beijing.aliyuncs.com/6LjjQA/Hi.gif"
          alt="Hi"
          width="24"
        />
        <strong>Hi there, I&#39;m Igarashi</strong>
        ，Is a python website developer
        <img
          src="https://media.giphy.com/media/WUlplcMpOCEmTGBtBW/giphy.gif"
          width="30"
        />
        ，Toss the front end if I am free [<code>Vue</code>, <code>React</code>]
      </p>
      <p>
        Like open source sharing
        <img
          src="https://media.giphy.com/media/mGcNjsfWAjY5AEZNw6/giphy.gif"
          width="50"
        />
      </p>
      <h3 className={styles.ctr_title}>Languages：</h3>
      <p>
        <a href="https://www.python.org/">
          <img src={`${img_perfix_path}python.png`} alt="Python" height="50" />
        </a>
        <a href="https://www.javascript.com/">
          <img src={`${img_perfix_path}js.png`} alt="JS" height="50" />
        </a>
      </p>
      <h3 className={styles.ctr_title}>framework：</h3>
      <p>
        <a href="https://www.djangoproject.com/">
          <img src={`${img_perfix_path}Django.png`} alt="Django" height="50" />
        </a>
        <a href="https://www.tornadoweb.org/">
          <img
            src={`${img_perfix_path}tornado.png`}
            alt="Tornado"
            height="50"
          />
        </a>
        <a href="https://fastapi.tiangolo.com/">
          <img
            src={`${img_perfix_path}fastapi.png`}
            alt="FastApi"
            height="50"
          />
        </a>
      </p>
      <p>
        <a href="https://v3.cn.vuejs.org/">
          <img src={`${img_perfix_path}vue.png`} alt="Vue" height="50" />
        </a>
        <a href="https://quasar.dev/">
          <img src={`${img_perfix_path}quasar.png`} alt="Quasar" height="50" />
        </a>
        <a href="https://facebook.github.io/react/">
          <img src={`${img_perfix_path}react.png`} alt="React" height="50" />
        </a>
        <a href="https://umijs.org/">
          <img src={`${img_perfix_path}umi.png`} alt="Umi" height="50" />
        </a>
      </p>
      <h3 className={styles.ctr_title}>My profile：</h3>
      <p>
        <a href="https://github.com/Igarashi-Chiduru">
          <img
            height="180em"
            src="https://github-readme-stats.vercel.app/api/top-langs/?username=Igarashi-Chiduru&hide=html,less&theme=radical&layout=compact"
          />
          <img
            height="180em"
            src="https://bad-apple-github-readme.vercel.app/api?show_bg=1&username=Igarashi-Chiduru&show_icons=true"
            alt="Igarashi's GitHub Stats"
          />
        </a>
      </p>
      <p>
        <img
          src={`${img_perfix_path}qb.gif`}
          alt="魔法少女QB"
          height="60"
          align="right"
        />
      </p>
      <p>Email address(2545369032@qq.com) welcome to contact ~ 💌</p>
      <p>In Shenzhen, welcome to play with me ! 🎮</p>
    </div>
  );
  const yan_content = (
    <div className={styles.popover_ctr}>
      <p>
        <strong>这个人很懒，什么都没写　(￣^￣゜)</strong>
      </p>
    </div>
  );

  return (
    <div>
      <Popover content={igarashi_content}>
        <a
          className={styles.head_link}
          target="_blank"
          href="https://github.com/Igarashi-Chiduru"
        >
          <img
            className={styles.head_img}
            src="https://gitee.com/igarashi/huan-plan/raw/master/note/public/img/igarashi.jpg"
            alt="Igarashi-Chiduru"
          />
          <br />
          <span>Igarashi</span>
        </a>
      </Popover>
      <Popover content={yan_content}>
        <a
          className={styles.head_link}
          target="_blank"
          href="https://gitee.com/yanchengzhao"
        >
          <img
            className={styles.head_img}
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAFbElEQVRoQ+1Ze0xbVRj/tbR0bXlDZ3lEBihxD12ciJs6p+hm1E3ZdGFZZILBDN1w0UQQTWZG4oNptkRBzAbZHJuPmMy3E0UGQ+d8bM6B2xwujlAKOOiDtpSuLTXnLLcUuIW2tzfW7p4/b79zzvf7ft/5XhV1PAIXrqAlEgCHOdsCw2FOMASGBYbDzAKCS4cZoVPgCAwLDIeZBQSXDjNChaDFq0sr5y5FSuluSONTYGjbB23DZlYHSq/4DMr5d8LWexbnK3N5dTJ+AS/IQ1rZPkgTUqFvaUBvXQkrmDlbmxF1/d2waU6j65n5oQtYkb0YcXcVQxwpZ1VSJJEhauFyRCjjMXLuGC71d7HKybNuhiz1Ojj0Wpg7vvMKeOySFYbDe+hZgS5ODMfdUYiUklqI5dGB3u/XvjGrCdr6TTAcafRrn6cwJ8BXHMMzmVkZbm9YAAzQ9xy1cAXEkQq47KNQF+2kUdqXRaK0tqGMytt1vbB0tviyzS8ZTm+Y7SZPNzb+8AEUc5deBjDUA6dZz6qcJD4ZkhgVTUt2fR9NUSRaX6i6xy8wvgjzCtjQ+i6cIwZERCXA0tECfeteVp2SHirHrKsXwD6kgfya3P8v4OmKDW9sMEWIJ8Mxuauhyq+AJDENfQ1lGP75Y1/IZK8NuPzzEHvbOiQ/tgPiWVHjh4tEEEXKIRJHuKsr1ZoXkLTyWYgkkaxK2PVaaN95ApYz7fAEbDz6IRJXPAlZ+g30PLhcMP74EXp2FoQ24NkFVZQhr4B1vdC8tYEGKQawy+m4DFIkgmvMCZvmDHTf1EHX9HbAYMlGXt8w49IMYMfwRTcwcjnbdwYw+d05YoTlVDOGvq6B5Y9WTkCZzSEL2HK6Dd2vrQIpJ4O5Qhbw5LSkLtwOp8VA20wSzQNdQQUcfeN9iL21ADG3rKEFCBeXngw4q/o45JmLYOk8jL+35QWKl9sbjln8MAhIRfYSSFVzIJYpJigyGfCYzQLz79/C5bBROUl8CpTzlsFhHJgStDyBReesQmppPSQxSdA11XkdJPhiBU4Mp1d8iuicB933kFLSPtgDSZyalWFfojRzJnm75s4WjFmHIc9YBFnaPDgtemh3ldLUFOjiBDjh3qegWl1JRzPDPx2EoX0/SDM/ecrBRGNfGI7PexzqDW/QoYHnImnK2H4AmtqiQLHSfZwAs93M1hIyhYfDNOguMMheb9/JfCt2yVr3YIHk4ZE/j0LfvJsT2KACJkGKKDl64SSkszNot2TTnoX1r19mVFKWnA1b37kJctLENKgLX4c88yb07dkC02+HZjzHF4GgMUzcW/1oNUQRUgwdehP9jeWUIeLycbevx0jXMfTsXDdBJ+LqCcs30jZSU1s8oR1U5T8P1dqtdF5GKrDu7flByclBA8xUSCSw9NVvhuH79yg45rvD+A8NOJ6Ff+L9T+Oq9a9Qb5hcIxNjpZd/AvJEiEEGP9+Bgfdf9IXEaWWCApgwmFxSQwON6cSX6H51pftShnmxTAnT8S/QXT0e1YlQRtURkPm106yjAzrSQzOLNCdkSEjaS9JPa2qKOA8FggJ4nF0D+veXTwku04GaySBpm/Yiblkhia+sBvOXcs6A3W4pU3qdUni6rr8sk/xLXDsy+VraTAwcqKRdU6CLE2DyzjJeaoE8K4fVJRmliFzmtjba15Kord21EaPdp9w6k8BGph7W87/i4sGXp3RGJLglPbAFphNfob/xuf+2liY5kzBIrN9bW+zV8CRlOa3DMJ9s8pscYrAIRSwnoMylnBj2W/MQ2CAADgESeFVBYJhX84bA4QLDIUACryoIDPNq3hA4XGA4BEjgVQWBYV7NGwKHCwyHAAm8qvAvvnpuUgWEur4AAAAASUVORK5CYII="
            alt="Igarashi-Chiduru"
          />
          <br />
          <span>燕成昭</span>
        </a>
      </Popover>
    </div>
  );
};

export default Introduce;
