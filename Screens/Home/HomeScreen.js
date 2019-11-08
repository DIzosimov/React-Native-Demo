import React, { Component } from "react"
import { StyleSheet, 
         Text, 
         View, 
         FlatList, 
         Button 
        } from "react-native"
import { Image } from "react-native-elements"
import { GetArticles } from "../../Services/ArticlesApiService"
import LoginForm from "./LoginForm"
import { authenticate } from "../../Services/AuthService"

class HomeScreen extends Component {
  state = {
    articles: [],
    renderLoginForm: false
  }

  componentDidMount() {
    GetArticles().then(res => {
      this.updateArticlesStateHandler(res)
    })
  }

  updateArticlesStateHandler(articles) {
    this.setState({
      articles: articles
    })
  }

  renderArticles({ item }) {
    const article = item
    return(
      <View>
        <Image
          style={{ width: 100, height: 100}}
          source={{ uri: article.image }}
        />
        <Text>{article.title}</Text>
        <Text>{article.content}</Text>
        <Text>{article.author}</Text>
        <Text>{article.publish_date}</Text>
      </View>
    )
  }

  onLogin = async () => {
    let resp = await authenticate(this.state.email, this.state.password)
    if (resp.authenticated) {
      this.setState({ authenticated: true, user: resp.user })
    } else {
      this.setState({ message: resp.message, renderLoginForm: false })
    }
  }

  renderLogin() {
    if (this.state.renderLoginForm) {
    return (
      <>
        <LoginForm
          loginHandler={this.onLogin.bind(this)}
          credentialHandler={this.credentialStateHandler}
        />
      </>
    )
    } else {
      return (
        <>
          <Button
            title="Login"
            onPress={() => this.setState({ renderLoginForm: true})}
          />
        </>
      )
    } 
  }

  render() {
    let renderLogin = this.renderLogin()

    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.articles}
          renderItem={this.renderArticles.bind(this)}
          keyExtractor={item => item.id.toString()}
        />
        {renderLogin}
      </View>
    )
  }
}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
      marginTop: "10%"
    }
  })
export default HomeScreen