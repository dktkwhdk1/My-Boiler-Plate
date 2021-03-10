import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';

/**
 * @param {*} SpecificComponent
 * @param {*} option
 *            null: 아무나 출입이 가능한 페이지
 *            true: 로그인한 유저만 출입이 가능한 페이지
 *            false: 로그인한 유저는 출입 불가능한 페이지
 * @param {*} adminRoute
 *            true: admin user
 */
export default function (SpecificComponent, option, adminRoute = null) {
  function AuthenticationCheck(props) {
    const dispatch = useDispatch();

    // 페이지 이동할때마다 backend에 request
    useEffect(() => {
      dispatch(auth()).then(response => {
        if (!response.payload.isAuth) {
          // 로그인 하지 않은 상태
          if (option) {
            // 로그인해야 출입이 가능한 페이지를 가려고 함
            props.history.push('/login');
          }
        } else {
          // 로그인한 상태
          if (adminRoute && !response.payload.isAdmin) {
            // 관리자가 아닌데 관리자 페이지를 가려고 함
            props.history.push('/');
          } else {
            if (!option) {
              // 로그인한 유저가 갈 수 없는 페이지를 가려고 함
              props.history.push('/');
            }
          }
        }
      });
    }, []);
    return <SpecificComponent />;
  }
  return AuthenticationCheck;
}
