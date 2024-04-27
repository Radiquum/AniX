"use client";

export const LogInNeeded = (props) => {
  return (
    <div className="absolute padding error center middle round">
      <i className="extra">no_accounts</i>
      <h5>Требуется авторизация</h5>
      <p>Для доступа к этой вкладке требуется авторизация в аккаунте anixart</p>
    </div>
  );
};
