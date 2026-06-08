package controller

import (
	"fmt"
	"path/filepath"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"

	"vue3_admin/pkg/snowflake"
	"vue3_admin/settings"
)

var FileController fileController

type fileController struct {
}

// allowedImageTypes 允许上传的图片扩展名白名单
var allowedImageTypes = map[string]bool{
	".jpg":  true,
	".jpeg": true,
	".png":  true,
	".gif":  true,
	".webp": true,
}

const maxFileSize = 10 << 20 // 10MB

// FileUpload 上传文件
// @Summary 上传文件接口
// @Description 上传文件
// @Tags 上传文件
// @Accept multipart/form-data
// @Produce application/json
// @Param token header string true "用户 Token"
// @Param file formData file true "文件"
// @Security ApiKeyAuth
// @Success 200 {object} ResponseData
// @Router /admin/product/fileUpload [post]
func (*fileController) FileUpload(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		zap.L().Error("get uploaded file failed", zap.Error(err))
		ResponseError(c, CodeServerBusy)
		return
	}

	// 1. 校验文件大小（10MB）
	if file.Size > maxFileSize {
		zap.L().Error("file size exceeds limit", zap.Int64("size", file.Size))
		ResponseErrorWithMsg(c, CodeInvalidParam, "文件大小不能超过10MB")
		return
	}

	// 2. 校验文件扩展名
	ext := strings.ToLower(filepath.Ext(file.Filename))
	if !allowedImageTypes[ext] {
		zap.L().Error("invalid file type", zap.String("ext", ext))
		ResponseErrorWithMsg(c, CodeInvalidParam, "只允许上传 jpg/jpeg/png/gif/webp 格式的图片")
		return
	}

	// 3. 生成随机文件名，避免路径遍历和文件名冲突
	randomName := fmt.Sprintf("%d%s", snowflake.GenID(), ext)
	now := time.Now()
	date := now.Format("20060102")
	staticPath := filepath.Base(settings.Conf.Static.Path)
	dist := fmt.Sprintf("%s/img/sph/%s/%s", staticPath, date, randomName)

	// 4. 上传文件到目标
	err = c.SaveUploadedFile(file, dist)
	if err != nil {
		zap.L().Error("save file failed", zap.Error(err))
		ResponseError(c, CodeServerBusy)
		return
	}

	imgUrl := fmt.Sprintf("/api/%s", dist)
	ResponseSuccess(c, imgUrl)
}
