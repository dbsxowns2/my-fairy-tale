package com.ssafy.user.api.service.impl;

import com.ssafy.user.api.dto.request.MyBookPostRequest;
import com.ssafy.user.api.dto.request.MyBookPutRequest;
import com.ssafy.user.api.service.MyBookService;
import com.ssafy.user.db.entity.MyBook;
import com.ssafy.user.db.repository.MyBookRepository;
import com.ssafy.user.db.repository.UserInfoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class MyBookServiceImpl implements MyBookService {

  private final UserInfoRepository userInfoRepository;
  private final MyBookRepository myBookRepository;

  @Transactional
  @Override
  public List<MyBook> findAllMyBooksByUserId(String userId) {

    // 해당 ID의 유저 존재 유무 확인
    var userInfo = userInfoRepository.findById(userId)
        .orElseThrow(() -> new IllegalArgumentException("없는 유저입니다."));

    // 유저가 소유한 모든 저장된 동화책들 조회
    return myBookRepository.findAllByUserInfo(userInfo);
  }

  @Override
  public MyBook findMyBookById(Integer bookId) {

    // 해당 ID인 동화책 중 저장된 동화책
    return myBookRepository.findById(bookId)
        .filter(MyBook::getIsSaved)
        .orElseThrow(() -> new IllegalArgumentException("없는 동화책 입니다."));
  }

  @Override
  public Integer saveMyBook(MyBookPostRequest request, String userId) {

    var userInfo = userInfoRepository.findById(userId)
        .orElseThrow(() -> new IllegalArgumentException("없는 유저 입니다."));

    var myBook = MyBook.builder()
      .userInfo(userInfo)
      .bookName("temp")
      .scenarioId(request.getScenarioId())
      .isSaved(false)
      .build();

    return myBookRepository.save(myBook).getBookId();
  }

  public Integer updateMyBook(MyBookPutRequest request, String userId) {

    userInfoRepository.findById(userId)
        .orElseThrow(() -> new IllegalArgumentException("없는 유저 입니다."));

    var myBook = myBookRepository.findById(request.getBookId())
        .orElseThrow(() -> new IllegalArgumentException("없는 동화책 입니다."));

    myBook = myBook.toBuilder()
        .bookName(request.getBookName())
        .isSaved(true)
        .build();

    return myBookRepository.save(myBook).getBookId();
  }

  @Override
  public void deleteMyBook(Integer bookId) {

    myBookRepository.findById(bookId)
        .orElseThrow(() -> new IllegalArgumentException("없는 동화책 입니다."));

    myBookRepository.deleteById(bookId);
  }
}
