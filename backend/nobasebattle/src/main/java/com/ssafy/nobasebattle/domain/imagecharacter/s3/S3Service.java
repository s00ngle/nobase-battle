package com.ssafy.nobasebattle.domain.imagecharacter.s3;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.ssafy.nobasebattle.domain.imagecharacter.exception.BadFileExtensionException;
import com.ssafy.nobasebattle.domain.imagecharacter.exception.FileEmptyException;
import com.ssafy.nobasebattle.domain.imagecharacter.exception.FileOversizeException;
import com.ssafy.nobasebattle.domain.imagecharacter.exception.FileUploadFailException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3Service {

    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    /**
     * S3에 파일 업로드
     * @param multipartFile 업로드할 파일
     * @param dirName 저장될 디렉토리 이름
     * @return 업로드된 파일의 S3 URL
     */
    public String uploadFile(MultipartFile multipartFile, String dirName) {
        // 파일 유효성 검사
        validateFile(multipartFile);

        // 파일명 중복 방지를 위한 UUID 생성
        String fileName = dirName + "/" + UUID.randomUUID() + "-" + multipartFile.getOriginalFilename();

        // 메타데이터 설정
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(multipartFile.getContentType());
        metadata.setContentLength(multipartFile.getSize());

        try {
            // S3에 업로드
            amazonS3.putObject(new PutObjectRequest(bucket, fileName, multipartFile.getInputStream(), metadata));

            // 업로드된 파일의 URL 반환
            return amazonS3.getUrl(bucket, fileName).toString();
        } catch (Exception e) {
            throw FileUploadFailException.EXCEPTION;
        }
    }

    /**
     * S3에서 파일 삭제
     * @param fileUrl 삭제할 파일의 S3 URL
     */
    public void deleteFile(String fileUrl) {
        // URL에서 파일 키 추출
        String fileName = fileUrl.substring(fileUrl.indexOf(bucket) + bucket.length() + 1);

        // S3에서 파일 삭제
        if (amazonS3.doesObjectExist(bucket, fileName)) {
            amazonS3.deleteObject(bucket, fileName);
        }
    }

    /**
     * 파일 유효성 검사
     */
    private void validateFile(MultipartFile file) {

        if (file.isEmpty() && file.getOriginalFilename() != null){
            throw FileEmptyException.EXCEPTION;
        }

        long maxFileSize = 10 * 1024 * 1024;
        if (file.getSize() > maxFileSize) {
            throw FileOversizeException.EXCEPTION;
        }

        // 파일 확장자 검사
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw FileEmptyException.EXCEPTION;
        }

        String ext = getFileExtension(originalFilename).toLowerCase();
        if (!isAllowedExtension(ext)) {
            throw BadFileExtensionException.EXCEPTION;
        }
    }

    /**
     * 파일 확장자 추출
     */
    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf(".") + 1);
    }

    /**
     * 허용된 확장자 검사
     */
    private boolean isAllowedExtension(String ext) {
        return ext.equals("jpg") || ext.equals("jpeg")
                || ext.equals("png") || ext.equals("gif");
    }
}
