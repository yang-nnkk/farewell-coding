package controller

import (
	"errors"
	"net/http"
)

type ResCode int64

const (
	CodeSuccess ResCode = 200 + iota
	CodeInvalidParam
	CodeUserExist
	CodeUserNotExist
	CodeInvalidPassword
	CodeServerBusy
	CodeInvalidToken
	CodeNeedLogin
	CodeMenuNodeExist
	CodeNoRoute
)

var codeMsgMap = map[ResCode]string{
	CodeSuccess:         "success",
	CodeInvalidParam:    "请求参数错误",
	CodeUserExist:       "用户名已存在",
	CodeUserNotExist:    "用户名不存在",
	CodeInvalidPassword: "用户名或密码错误",
	CodeServerBusy:      "服务繁忙",
	CodeNoRoute:         "请求路径不存在",
	CodeMenuNodeExist:   "该节点下有子节点，不可以删除",

	CodeInvalidToken: "无效的Token",
	CodeNeedLogin:    "需要登录",
}

// codeHTTPMap 将业务错误码映射到 HTTP 状态码
var codeHTTPMap = map[ResCode]int{
	CodeSuccess:         http.StatusOK,
	CodeInvalidParam:    http.StatusBadRequest,
	CodeUserExist:       http.StatusBadRequest,
	CodeUserNotExist:    http.StatusBadRequest,
	CodeInvalidPassword: http.StatusBadRequest,
	CodeServerBusy:      http.StatusInternalServerError,
	CodeInvalidToken:    http.StatusUnauthorized,
	CodeNeedLogin:       http.StatusUnauthorized,
	CodeMenuNodeExist:   http.StatusBadRequest,
	CodeNoRoute:         http.StatusNotFound,
}

var codeErrorMap = map[ResCode]error{
	CodeMenuNodeExist: errors.New("该节点下有子节点，不可以删除"),
}

func (c ResCode) Msg() string {
	msg, ok := codeMsgMap[c]
	if !ok {
		msg = codeMsgMap[CodeServerBusy]
	}
	return msg
}

// HTTPStatus 返回对应的 HTTP 状态码
func (c ResCode) HTTPStatus() int {
	status, ok := codeHTTPMap[c]
	if !ok {
		return http.StatusInternalServerError
	}
	return status
}
