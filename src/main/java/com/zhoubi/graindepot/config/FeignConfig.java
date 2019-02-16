package com.zhoubi.graindepot.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;

/**
 * Created by zhanghao on 2018/4/25.
 */
@Configuration
public class FeignConfig {
    @Bean
    public RequestInterceptor requestInterceptor() {
        return new RequestInterceptor() {
            @Override
            public void apply(RequestTemplate requestTemplate) {
                {
                    String sessionId = RequestContextHolder.currentRequestAttributes().getSessionId();
                    requestTemplate.header("Cookie", "SESSION=" + sessionId);
                }
            }
        };
    }

    /*@Bean
    public RedisTemplate redisTemplate(){
        RedisTemplate redisTemplate=new RedisTemplate();
        redisTemplate.setValueSerializer(new GenericToStringSerializer<Long>(Long.class));
        return redisTemplate;
    }*/

    /*@Bean
    public RedisTemplate<?, ?> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<String, Object>();
        template.setConnectionFactory(connectionFactory);
        template.setValueSerializer(new GenericToStringSerializer<Long>(Long.class));
        template.setKeySerializer(new GenericToStringSerializer<Long>(Long.class));
        template.afterPropertiesSet();
        return template;
    }*/

}
