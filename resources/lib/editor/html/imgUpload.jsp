<%@ page language="java" contentType="text/html; charset=EUC-KR"
	pageEncoding="EUC-KR"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=EUC-KR">
<title>Insert title here</title>
</head>
<body>

	<form action="/uploadImage" method="post" enctype="multipart/form-data"
		name="writeForm">
		<input type="file" name="uploadedFile" value="이미지 선택" /><br /> <input
			type="submit" value="이미지 본문에 추가" />
	</form>
</body>
</html>