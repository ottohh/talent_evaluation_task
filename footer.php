<?php
/**
 * The template for displaying the footer
 *
 * Contains the opening of the #site-footer div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package WordPress
 * @subpackage Twenty_Twenty
 * @since 1.0.0
 */

?>
			<footer id="site-footer" role="contentinfo" class="header-footer-group">

				<div class="section-inner">

					<div class="footer-credits">

						<p class="footer-copyright">&copy;
							<?php
							echo date_i18n(
								/* translators: Copyright date format, see https://secure.php.net/date */
								_x( 'Y', 'copyright date format', 'twentytwenty' )
							);
							?>
							<a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php bloginfo( 'name' ); ?></a>
						</p><!-- .footer-copyright -->

						<p class="powered-by-wordpress">
							<a href="<?php echo esc_url( __( 'https://wordpress.org/', 'twentytwenty' ) ); ?>">
								<?php _e( 'Powered by WordPress', 'twentytwenty' ); ?>
							</a>
						</p><!-- .powered-by-wordpress -->

					</div><!-- .footer-credits -->

					<a class="to-the-top" href="#site-header">
						<span class="to-the-top-long">
							<?php
							/* translators: %s: HTML character for up arrow */
							printf( __( 'To the top %s', 'twentytwenty' ), '<span class="arrow" aria-hidden="true">&uarr;</span>' );
							?>
						</span><!-- .to-the-top-long -->
						<span class="to-the-top-short">
							<?php
							/* translators: %s: HTML character for up arrow */
							printf( __( 'Up %s', 'twentytwenty' ), '<span class="arrow" aria-hidden="true">&uarr;</span>' );
							?>
						</span><!-- .to-the-top-short -->
					</a><!-- .to-the-top -->

				</div><!-- .section-inner -->

			</footer><!-- #site-footer -->
			<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
		<?php wp_footer(); 

			/* Loput koodista ovat omaa phptani 
			niiden tarkoituksena on ladata oikeat javascript koodit sivuston id numeron ja url parametrien perusteella.

			*/
			$ServerAddress = esc_url( home_url( '/../' ));;
			//Lisää tarvittavat javascript koodit sivun id numeron mukaan.
			if(get_the_ID()==2){
				//activity page 
				?>
				

				<script src="<?php echo $ServerAddress ?>/GetEventData.js"></script>
			<?php

			}

			if(get_the_ID()==8){
				//main page
				$api_address =$_GET["api"];
				$default_address = "https://api.hel.fi/linkedevents/v1/event/?start=today&language=fi";
				?>
				
				

				

				
				<script> var api_address = "<?php 
				/* Muuttuja api_address on se osoite johon javascript koodi suorittaa kyselyn saadakseen 
				
				*/
				if($api_address==null){echo $default_address;} 
				if($api_address!=null){ 
					
					// Syötteen tulostaminen takaisin selaimeen ei aiheuta xss haavoittuvuutta ainakaan firefoxsissa, mutta ihan ny varmistuksen vuoks.
					if(strpos(urldecode($api_address),'"' ) !== false){
						die('XSS attempt detected!"; alert("älä ees yritä");</script>');

					}
					echo $api_address;
				}
					?>";</script>


				<script src="<?php echo $ServerAddress ?>/HomePageLoadEvents.js"></script>
				
				
				

				<?php 

				

			
			}
			
		

		?>

	</body>
</html>
